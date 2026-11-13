import React, { useRef, useState, useEffect } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Subtitles,
  SkipBack,
  SkipForward,
  Settings,
  CheckCircle,
} from 'lucide-react';

const playbackRates = [0.5, 1, 1.25, 1.5, 2];

export default function CustomVideoPlayer({
  videoUrl,
  vttUrl,
  initialPosition = 0,
  onPositionUpdate,
  onVideoEnd,
  onNextLesson,
  onPrevLesson,
  hasPrev = false,
  hasNext = false,
  title = '',
}) {
  const videoRef = useRef(null);
  const containerRef = useRef(null);
  const controlsTimeoutRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSubtitles, setShowSubtitles] = useState(true);
  const [showControls, setShowControls] = useState(true);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [bufferedEnd, setBufferedEnd] = useState(0);

  // Format seconds to MM:SS
  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const mins = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Resume playback position on video load
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setDuration(videoRef.current.duration);
      if (initialPosition > 0 && initialPosition < videoRef.current.duration) {
        videoRef.current.currentTime = initialPosition;
        setCurrentTime(initialPosition);
      }
    }
  };

  // Play / Pause toggle
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Time update listener
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const curr = videoRef.current.currentTime;
    setCurrentTime(curr);

    // Track buffer progress
    if (videoRef.current.buffered.length > 0) {
      setBufferedEnd(videoRef.current.buffered.end(videoRef.current.buffered.length - 1));
    }

    if (onPositionUpdate) {
      onPositionUpdate(curr, videoRef.current.duration);
    }
  };

  // Seek bar scrub
  const handleSeek = (e) => {
    if (!videoRef.current) return;
    const seekTime = parseFloat(e.target.value);
    videoRef.current.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  // Seek forward / back 10 seconds
  const seekDelta = (delta) => {
    if (!videoRef.current) return;
    const target = Math.max(0, Math.min(duration, videoRef.current.currentTime + delta));
    videoRef.current.currentTime = target;
    setCurrentTime(target);
  };

  // Volume scrub
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (!videoRef.current) return;
    if (isMuted) {
      videoRef.current.muted = false;
      videoRef.current.volume = volume || 0.8;
      setIsMuted(false);
    } else {
      videoRef.current.muted = true;
      setIsMuted(true);
    }
  };

  // Playback Rate
  const handleSpeedSelect = (rate) => {
    setPlaybackSpeed(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
    setShowSpeedMenu(false);
  };

  // Fullscreen toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.error(err));
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch((err) => console.error(err));
      setIsFullscreen(false);
    }
  };

  // Subtitles / Captions toggle
  const toggleSubtitles = () => {
    if (!videoRef.current) return;
    const tracks = videoRef.current.textTracks;
    if (tracks && tracks.length > 0) {
      const mode = showSubtitles ? 'disabled' : 'showing';
      tracks[0].mode = mode;
      setShowSubtitles(!showSubtitles);
    } else {
      setShowSubtitles(!showSubtitles);
    }
  };

  // Auto-hide controls during playback
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  // Spacebar play/pause shortcut
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
        togglePlay();
      } else if (e.code === 'ArrowRight') {
        seekDelta(5);
      } else if (e.code === 'ArrowLeft') {
        seekDelta(-5);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, duration]);

  // Video ended callback
  const handleEnded = () => {
    setIsPlaying(false);
    if (onVideoEnd) onVideoEnd();
  };

  // Public seek method exposed via container
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.seekTo = (seconds) => {
        if (videoRef.current) {
          videoRef.current.currentTime = seconds;
          setCurrentTime(seconds);
          if (!isPlaying) {
            videoRef.current.play();
            setIsPlaying(true);
          }
        }
      };
    }
  }, [isPlaying]);

  return (
    <div
      ref={containerRef}
      id="custom-video-player-container"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl select-none group focus:outline-none"
      tabIndex="0"
    >
      {/* Native HTML5 Video Element */}
      <video
        ref={videoRef}
        src={videoUrl}
        crossOrigin="anonymous"
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        onClick={togglePlay}
        className="w-full h-full object-contain cursor-pointer"
        playsInline
      >
        {vttUrl && (
          <track
            src={vttUrl}
            kind="subtitles"
            srcLang="en"
            label="English"
            default={showSubtitles}
          />
        )}
      </video>

      {/* Central Big Play/Pause Button on Pause */}
      {!isPlaying && (
        <div
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] cursor-pointer transition-all"
        >
          <div className="w-20 h-20 rounded-full bg-brand-600/90 text-white flex items-center justify-center shadow-lg hover:scale-110 hover:bg-brand-500 transition-all">
            <Play className="w-9 h-9 fill-white ml-1" />
          </div>
        </div>
      )}

      {/* Top Title Bar Overlay */}
      <div
        className={`absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 pointer-events-none ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <p className="text-white text-sm font-semibold truncate drop-shadow-md">{title}</p>
      </div>

      {/* Bottom Controls Bar Overlay */}
      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pb-3 pt-6 transition-opacity duration-300 ${
          showControls ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Scrubber Seekbar Container */}
        <div className="relative flex items-center group/seek mb-2">
          {/* Buffered Background Bar */}
          <div className="absolute left-0 right-0 h-1.5 bg-white/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/30"
              style={{ width: `${duration ? (bufferedEnd / duration) * 100 : 0}%` }}
            />
          </div>

          {/* Active Played Progress Bar */}
          <div
            className="absolute left-0 h-1.5 bg-brand-500 rounded-full pointer-events-none"
            style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
          />

          {/* Actual Range Input */}
          <input
            type="range"
            min="0"
            max={duration || 100}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="w-full h-1.5 opacity-0 cursor-pointer z-10"
          />
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between text-white text-xs">
          {/* Left Controls: Play, Skip, Volume, Time */}
          <div className="flex items-center gap-3">
            {/* Previous Lesson */}
            <button
              onClick={onPrevLesson}
              disabled={!hasPrev}
              className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
                !hasPrev ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              title="Previous Lesson"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            >
              {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            </button>

            {/* Next Lesson */}
            <button
              onClick={onNextLesson}
              disabled={!hasNext}
              className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
                !hasNext ? 'opacity-40 cursor-not-allowed' : ''
              }`}
              title="Next Lesson"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Volume & Mute */}
            <div className="flex items-center gap-1.5 group/vol">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              >
                {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-14 sm:w-20 h-1 bg-white/30 rounded-lg accent-brand-500 cursor-pointer"
              />
            </div>

            {/* Time Display */}
            <div className="text-slate-300 font-mono text-[11px] ml-1">
              <span>{formatTime(currentTime)}</span>
              <span className="mx-1 text-slate-500">/</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Right Controls: Speed, Captions, Fullscreen */}
          <div className="flex items-center gap-2 relative">
            {/* Playback Speed Selector */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="px-2 py-1 rounded-md bg-white/10 hover:bg-white/20 text-[11px] font-semibold transition-colors flex items-center gap-1"
                title="Playback Speed"
              >
                <span>{playbackSpeed}x</span>
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 bg-slate-900 border border-slate-700 rounded-xl py-1 shadow-xl z-20 min-w-[70px]">
                  {playbackRates.map((rate) => (
                    <button
                      key={rate}
                      onClick={() => handleSpeedSelect(rate)}
                      className={`w-full px-3 py-1 text-left text-xs hover:bg-brand-600 transition-colors ${
                        playbackSpeed === rate ? 'text-brand-400 font-bold' : 'text-slate-300'
                      }`}
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Subtitles / Captions */}
            <button
              onClick={toggleSubtitles}
              className={`p-1.5 rounded-lg hover:bg-white/10 transition-colors ${
                showSubtitles ? 'text-brand-400 font-bold' : 'text-slate-400'
              }`}
              title={showSubtitles ? 'Disable Subtitles' : 'Enable Subtitles'}
            >
              <Subtitles className="w-4 h-4" />
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={toggleFullscreen}
              className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
