  "use client";
  import React from 'react';

  interface BokehBackgroundProps {
    className?: string;
  }

  /**
   * BokehBackground component creates the blurred light effect circles
   * seen in the Cisco NetConnect PUP - Manila website design
   */
  const BokehBackground: React.FC<BokehBackgroundProps> = ({ className = '' }) => {
    return (
      <div className={`bokeh-container ${className}`}>
        {/* Blue bokeh circles */}
        <div className="bokeh-circle bokeh-circle-1" />
        <div className="bokeh-circle bokeh-circle-2" />
        <div className="bokeh-circle bokeh-circle-3" />
        <div className="bokeh-circle bokeh-circle-4" />
        {/* Gold accent bokeh */}
        <div className="bokeh-circle bokeh-circle-5" />
        
        {/* Gradient overlay for depth */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0, 26, 51, 0.4) 100%)',
          }}
        />
      </div>
    );
  };

  export default BokehBackground;
