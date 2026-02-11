import React, { useEffect } from 'react';

interface GoogleAdProps {
  type?: 'inline' | 'side';
}

const GoogleAd: React.FC<GoogleAdProps> = ({ type = 'inline' }) => {
  useEffect(() => {
    try {
      (window as any).adsbygoogle = (window as any).adsbygoogle || [];
      (window as any).adsbygoogle.push({});
    } catch (e) {
      console.error('AdSense push failed', e);
    }
  }, []);

  if (type === 'side') {
    return (
      <div className="w-[160px] h-[600px] bg-black/20 border border-white/5 rounded-lg overflow-hidden hidden xl:block sticky top-24">
        <ins className="adsbygoogle"
          style={{ display: 'inline-block', width: '160px', height: '600px' }}
          data-ad-client="ca-pub-5062970718213147"
          data-ad-slot="auto"
          data-ad-format="vertical"
          data-full-width-responsive="false"></ins>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto my-4 overflow-hidden rounded-xl border border-white/5 bg-black/20">
      <ins className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-5062970718213147"
        data-ad-slot="auto"
        data-ad-format="auto"
        data-full-width-responsive="true"></ins>
    </div>
  );
};

export default GoogleAd;
