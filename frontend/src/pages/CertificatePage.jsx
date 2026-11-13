import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Printer,
  Award,
  CheckCircle2,
  Calendar,
  Share2,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { verifyCertificate } from '../services/certificateService';

export default function CertificatePage() {
  const { certificateId } = useParams();
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCert = async () => {
      try {
        setLoading(true);
        const data = await verifyCertificate(certificateId);
        setCert(data.certificate);
      } catch (err) {
        console.error('Failed to verify certificate:', err);
        setError('Certificate not found or ID is invalid.');
      } finally {
        setLoading(false);
      }
    };

    if (certificateId) {
      fetchCert();
    }
  }, [certificateId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6 text-center">
        <Award className="w-12 h-12 text-slate-400 mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-1">Certificate Not Found</h2>
        <p className="text-xs text-slate-500 mb-4">{error || 'Invalid Certificate ID'}</p>
        <Link to="/courses" className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold">
          Browse Courses
        </Link>
      </div>
    );
  }

  const formattedDate = new Date(cert.issueDate).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="min-h-screen bg-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      {/* Top Action Bar (Hidden during print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          to="/dashboard"
          className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Verified Credential
          </span>

          <button
            onClick={handlePrint}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save PDF</span>
          </button>
        </div>
      </div>

      {/* Official Certificate Container (Targeted by @media print) */}
      <div className="max-w-4xl mx-auto">
        <div
          id="certificate-print-area"
          className="bg-white rounded-3xl border-8 border-double border-amber-600/30 p-8 sm:p-14 shadow-2xl relative overflow-hidden select-none"
        >
          {/* Subtle Watermark Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
            <Award className="w-[500px] h-[500px] text-slate-900" />
          </div>

          {/* Ornate Corner Elements */}
          <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-500/60 rounded-tl-xl" />
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-500/60 rounded-tr-xl" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-500/60 rounded-bl-xl" />
          <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-500/60 rounded-br-xl" />

          {/* Certificate Header */}
          <div className="text-center space-y-2 relative z-10 mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-white shadow-lg mx-auto mb-2">
              <Award className="w-9 h-9" />
            </div>
            <h1 className="text-xs uppercase tracking-[0.3em] font-extrabold text-amber-700">
              EduPulse Institute of Online Learning
            </h1>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 tracking-tight">
              Certificate of Completion
            </h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto rounded-full mt-2" />
          </div>

          {/* Recipient Content */}
          <div className="text-center space-y-6 relative z-10 mb-10">
            <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-medium">
              This is to certify that
            </p>

            <h3 className="text-2xl sm:text-4xl font-serif italic font-bold text-slate-900 border-b-2 border-slate-200 pb-3 max-w-lg mx-auto">
              {cert.recipientName}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto leading-relaxed">
              has successfully fulfilled all curriculum requirements, watched required interactive video lectures, passed technical assessments, and achieved mastery in
            </p>

            <h4 className="text-xl sm:text-2xl font-black text-brand-900 max-w-2xl mx-auto leading-snug">
              {cert.courseTitle}
            </h4>

            <div className="inline-block px-4 py-1.5 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
              Grade: {cert.grade || 'Passed with Distinction'}
            </div>
          </div>

          {/* Certificate Footer: Date, Seals, Signatures, Unique ID */}
          <div className="pt-8 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 items-end text-center relative z-10">
            {/* Issue Date */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-800">{formattedDate}</p>
              <div className="w-32 h-0.5 bg-slate-300 mx-auto" />
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Date of Issuance
              </p>
            </div>

            {/* Official Gold Seal Badge */}
            <div className="flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full border-4 border-amber-400 bg-amber-50 flex flex-col items-center justify-center shadow-md text-amber-800 p-1">
                <Sparkles className="w-5 h-5 text-amber-600" />
                <span className="text-[8px] font-black uppercase tracking-wider mt-0.5">Official</span>
                <span className="text-[7px] font-bold text-amber-700">Verified</span>
              </div>
            </div>

            {/* Instructor Signature */}
            <div className="space-y-1">
              <p className="font-serif italic text-base text-slate-800">
                {cert.instructorName || 'Sarah Jenkins'}
              </p>
              <div className="w-32 h-0.5 bg-slate-300 mx-auto" />
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Authorized Instructor
              </p>
            </div>
          </div>

          {/* Certificate ID & Verification URL */}
          <div className="mt-8 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
            <span className="font-mono">
              Certificate ID: <strong className="text-slate-700">{cert.certificateId}</strong>
            </span>
            <span>
              Verifiable Online Credential • EduPulse EdTech
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
