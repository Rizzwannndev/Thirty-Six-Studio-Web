import React, { useRef, useEffect, useCallback, useState } from 'react';
import Canvas from './Canvas';
import data from './data';
import LocomotiveScroll from 'locomotive-scroll';
import Cursor from './Components/Cursor';
import gsap from 'gsap';

const App = () => {
  const scrollRef = useRef(null);
  const locoRef = useRef(null); // save instance
  const canvasWrapperRef = useRef(null);
  const canvasWrapper2Ref = useRef(null);

  const [showCanvas, setShowCanvas] = useState(false);
  const [canvasVisible, setCanvasVisible] = useState(false);
  const [showCursor, setShowCursor] = useState(true);
  const headingref = useRef(null);

  useEffect(() => {
    let overlay = document.getElementById('bg-fill-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'bg-fill-overlay';
      overlay.className = 'bg-fill-overlay';
      document.body.appendChild(overlay);
    }
    document.body.style.backgroundColor = '#ffffff';
    setShowCursor(false); // Hide cursor follower when bg is white on mount
    return () => {
      if (overlay && overlay.parentNode) {
        overlay.parentNode.removeChild(overlay);
      }
    };
  }, []);

  useEffect(() => {
    if (!scrollRef.current) return;

    // Destroy existing instance first if exists
    if (locoRef.current) {
      locoRef.current.destroy();
      locoRef.current = null;
    }
    // Always init after mount/re-mount, and on show/hide canvas
    locoRef.current = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      lerp: 0.085,
      getDirection: true,
      tablet: { smooth: true },
      smartphone: { smooth: true }
    });

    // On animation frame, update locomotive-scroll
    const tick = () => {
      if (locoRef.current) {
        locoRef.current.update();
        requestAnimationFrame(tick);
      }
    };
    // Start ticking
    requestAnimationFrame(tick);

    return () => {
      if (locoRef.current) {
        locoRef.current.destroy();
        locoRef.current = null;
      }
    };
  }, [canvasVisible, showCanvas]);

  // handle appear/disappear animation for canvases
  useEffect(() => {
    if (showCanvas) {
      setCanvasVisible(true); // mount
      setTimeout(() => {
        // Animate canvases in with GSAP
        if (canvasWrapperRef.current) {
          gsap.fromTo(
            canvasWrapperRef.current.children,
            { opacity: 0, scale: 0.5 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              stagger: 0.06,
              ease: "power2.out"
            }
          );
        }
        if (canvasWrapper2Ref.current) {
          gsap.fromTo(
            canvasWrapper2Ref.current.children,
            { opacity: 0, scale: 0.5 },
            {
              opacity: 1,
              scale: 1,
              duration: 0.5,
              stagger: 0.06,
              ease: "power2.out"
            }
          );
        }
      }, 0);
    } else if (!showCanvas) {
      if (canvasWrapperRef.current) {
        gsap.to(
          canvasWrapperRef.current.children,
          {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.in",
            onComplete: () => setCanvasVisible(false)
          }
        );
      }
      if (canvasWrapper2Ref.current) {
        gsap.to(
          canvasWrapper2Ref.current.children,
          {
            opacity: 0,
            scale: 0.5,
            duration: 0.5,
            stagger: 0.06,
            ease: "power2.in"
          }
        );
      }
    }
  }, [showCanvas]);

  const navLinks = [
    { name: 'What we do', href: '#' },
    { name: 'Who we are', href: '#gallery' },
    { name: 'How we give back', href: '#about' },
    { name: 'Talk to us', href: '#contact' },
  ];

  const handleHeadMouseEnter = useCallback(() => {
    const cursor = document.getElementById('cursor');
    if (cursor) {
      gsap.to(cursor, { scale: 12, duration: 0.3 });
      // While hovering the main headings, push the cursor behind them
      cursor.style.zIndex = '-1';
    }
  }, []);

  const handleHeadMouseLeave = useCallback(() => {
    const cursor = document.getElementById('cursor');
    if (cursor) {
      gsap.to(cursor, { scale: 1, duration: 0.3 });
      // Restore cursor above general content but below key headings
      cursor.style.zIndex = '250';
    }
  }, []);

  // Balloon fill animation for turning canvas on
  const triggerBalloonFill = (clientX, clientY) => {
    const overlay = document.getElementById('bg-fill-overlay');
    if (!overlay) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;

    const dx = clientX < vw / 2 ? vw - clientX : clientX;
    const dy = clientY < vh / 2 ? vh - clientY : clientY;
    const radius = Math.sqrt(dx * dx + dy * dy);
    const size = radius * 2;

    overlay.style.width = `${size}px`;
    overlay.style.height = `${size}px`;
    overlay.style.left = `${clientX - size / 2}px`;
    overlay.style.top = `${clientY - size / 2}px`;

    overlay.style.transition = 'none';
    overlay.classList.remove('active');
    overlay.style.transform = 'scale(0)';
    // force reflow
    overlay.offsetHeight;
    overlay.style.transition = 'transform 1s ease-out';
    overlay.classList.add('active');

    setTimeout(() => {
      document.body.style.backgroundColor = '#fd2c2a';
      setShowCursor(true); // Show cursor follower on red bg
    }, 1000);
  };

  // Toggle canvas (calls balloon if on)
  const handleHeadingClick = (e) => {
    setShowCanvas((prev) => {
      const next = !prev;
      if (next) {
        const { clientX, clientY } = e;
        triggerBalloonFill(clientX, clientY);
      } else {
        document.body.style.backgroundColor = '#ffffff';
        setShowCursor(false); // Hide cursor follower on white bg
      }
      return next;
    });
  };

  return (
    <>
      <div
        className="w-full relative min-h-screen z-10"
        data-scroll-container
        ref={scrollRef}
      >
        {showCursor && <Cursor isCanvasActive={showCanvas} />}
        {/* Only show canvases if canvasVisible is true (for animation timing) */}
        <div
          ref={canvasWrapperRef}
          style={{ pointerEvents: "none", position: "absolute", inset: 0 }}
        >
          {canvasVisible &&
            data[0].map((canvasDetails, idx) => (
              <div key={idx} style={{ position: "absolute", inset: 0 }}>
                <Canvas details={canvasDetails} />
              </div>
            ))
          }
        </div>
        <div className="w-full h-screen relative" style={{ position: "relative", zIndex: 10 }}>
          <nav className={`${showCanvas ? 'bg-[#fd2c2a]' : 'bg-white'} py-3 px-5 w-full top-0 left-0 z-50 border-b transition-colors duration-300`}>
            <div className="flex items-center justify-between w-full max-w-7xl mx-auto">
              <div className="text-lg font-regular tracking-tight">
                Thirtysixstudios
              </div>
              <ul className="flex space-x-8 gap-4 mr-20">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-md font-regular hover:text-red-300 transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          <div className="textContainer w-full px-[18%] p-[4%]">
            <div className="text w-[50%]">
              <h3 className="text-4xl font-normal leading-[1.2] mt-3 font-[Helvetica]">
                At Thirtysixstudio, we build digital assets and immersive experiences for purposeful brands.
              </h3>
              <p className="textMid text-[14px] font-[Poppins] font-light w-[85%] mt-5">
                We're a boutique production studio focused on design, animation, and technology, constantly rethinking what digital craft can do for present-day ads and campaigns.
              </p>
              <p className="textMid text-xl font-regular mt-6">Scroll</p>
            </div>
          </div>
          <div className="w-full">
            <h1
              ref={headingref}
              onMouseEnter={handleHeadMouseEnter}
              onMouseLeave={handleHeadMouseLeave}
              onClick={handleHeadingClick}
              className='main-head text-[11.3rem] tracking-normal leading-none absolute bottom-5 left-3 z-300'
            >
              Thirtysixstudios
            </h1>
          </div>
        </div>
      </div>
      {/* sec-2 with Canvas */}
      <div
        className="sec-2 w-full flex items-center justify-center flex-col relative"
        style={{
          minHeight: "100vh",
          height: "100vh"
        }}
        data-scroll-section
      >
        <div
          ref={canvasWrapper2Ref}
          style={{ pointerEvents: "none", position: "absolute", inset: 0 }}
        >
          {canvasVisible &&
            data[1]?.map((canvasDetails, idx) => (
              <div key={idx} style={{ position: "absolute", inset: 0 }}>
                <Canvas details={canvasDetails} />
              </div>
            ))
          }
        </div>
        <h1
          className='text-8xl z-300'
          onMouseEnter={handleHeadMouseEnter}
          onMouseLeave={handleHeadMouseLeave}
          style={{ marginBottom: 0 }}
        >
          Our Services!
        </h1>
        <p className='text-4xl leading-[1.2] w-[80%] mt-10 tracking-tight font-normal text-center'
           style={{ marginBottom: 0 }}>
          We provide you with captivating design, interactive animations, reliablecode, and immaculate project coordination.Whether you need a campaign built from scratch or assistance at a specific phase, we’ve got you covered.
        </p>
      </div>
    </>
  );
};

export default App;