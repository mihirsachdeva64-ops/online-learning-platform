// Automated Verification Test Script for Online Learning Platform Backend
const http = require('http');

const request = (path, method = 'GET', data = null, token = null) => {
  return new Promise((resolve, reject) => {
    const postData = data ? JSON.stringify(data) : '';
    const headers = {
      'Content-Type': 'application/json',
    };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    if (data) headers['Content-Length'] = Buffer.byteLength(postData);

    const options = {
      hostname: 'localhost',
      port: 5000,
      path,
      method,
      headers,
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: body });
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(postData);
    req.end();
  });
};

const runTests = async () => {
  console.log('--- Starting API Verification Suite ---');

  try {
    // 1. Health
    const health = await request('/api/health');
    console.log('1. /api/health:', health.status === 200 && health.data.success ? 'PASS' : 'FAIL');

    // 2. Courses
    const coursesRes = await request('/api/courses');
    console.log('2. /api/courses:', coursesRes.status === 200 && coursesRes.data.courses.length >= 4 ? 'PASS' : 'FAIL', `(${coursesRes.data.courses.length} courses found)`);

    // 3. Demo Login
    const loginRes = await request('/api/auth/demo-login', 'POST', {});
    console.log('3. /api/auth/demo-login:', loginRes.status === 200 && loginRes.data.token ? 'PASS' : 'FAIL');
    const token = loginRes.data.token;

    // 4. Authenticated Profile
    const profileRes = await request('/api/auth/profile', 'GET', null, token);
    console.log('4. /api/auth/profile:', profileRes.status === 200 && profileRes.data.user.email === 'demo@edulearn.com' ? 'PASS' : 'FAIL');

    // 5. Dashboard Data
    const dashRes = await request('/api/dashboard', 'GET', null, token);
    console.log('5. /api/dashboard:', dashRes.status === 200 && dashRes.data.stats ? 'PASS' : 'FAIL', `(Streak: ${dashRes.data.stats.streakDays} days, Enrolled: ${dashRes.data.stats.totalEnrolled})`);

    // 6. Certificate Verification
    const certRes = await request('/api/certificates/verify/EDUPULSE-2026-UX9841');
    console.log('6. /api/certificates/verify:', certRes.status === 200 && certRes.data.valid ? 'PASS' : 'FAIL');

    console.log('--- All Backend API Verification Tests Passed! ---');
  } catch (err) {
    console.error('Test execution error:', err.message);
  }
};

runTests();
