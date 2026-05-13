import React from 'react';
import { Play, ExternalLink, Info } from 'lucide-react';

interface AdGatewayProps {
  onUnlock: () => void;
}

export function AdGateway({ onUnlock }: AdGatewayProps) {
  const handleWatchAd = () => {
    // -------------------------------------------------------------------------
    // DEVELOPER INSTRUCTIONS FOR SMARTLINK PLACEMENT:
    // 1. Replace the "smartLinkUrl" below with your actual ad network smartlink.
    // 2. You can also listen to URL callbacks if your ad network supports them 
    //    to verify the ad was watched before calling onUnlock().
    // -------------------------------------------------------------------------
    
    const smartLinkUrl = "https://www.profitablecpmratenetwork.com/eptfdgegw?key=9029ed441555986ae5243084e752e0d5";
    
    // Open the smartlink in a new tab
    window.open(smartLinkUrl, '_blank');
    
    // Unlock the app locally for the user
    onUnlock();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in duration-300">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <Play className="w-8 h-8 ml-1" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Unlock SQL Builder</h2>
        <p className="text-slate-600 mb-8 leading-relaxed">
          To keep this application free for everyone, we require users to watch a quick advertisement before starting.
        </p>
        
        <button
          onClick={handleWatchAd}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-xl flex items-center justify-center gap-2 mb-8 transition-colors shadow-lg shadow-blue-200 text-lg"
        >
          Watch Ad to Continue
          <ExternalLink className="w-5 h-5" />
        </button>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-sm text-slate-600">
          <h3 className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
            <Info className="w-4 h-4 text-blue-500" />
            Developer Note: Smartlink Placement
          </h3>
          <p className="mb-3 text-xs leading-relaxed">
            The smartlink URL has been configured in <code>src/components/AdGateway.tsx</code>. 
            Find the <code>handleWatchAd</code> function and replace the placeholder URL with your ad network's URL.
          </p>
          <div className="bg-slate-800 text-slate-200 p-3 rounded-lg text-xs font-mono overflow-auto">
            const smartLinkUrl = "YOUR_URL_HERE";<br />
            window.open(smartLinkUrl, '_blank');
          </div>
        </div>
      </div>
    </div>
  );
}
