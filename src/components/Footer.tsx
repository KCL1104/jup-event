export function Footer() {
  return (
    <footer className="relative z-10 py-8 px-8 mt-12 border-t border-gray-800/50">
      <div className="max-w-7xl mx-auto">
        {/* Disclaimer */}
        <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-xl p-4 mb-6">
          <p className="text-yellow-400/80 text-xs leading-relaxed text-center">
            <strong>Disclaimer:</strong> This tool is provided for informational and convenience purposes only. 
            It does not constitute financial advice. Using this tool involves risks including but not limited to 
            smart contract risks, liquidation risks, and market volatility. Users are solely responsible for 
            their own investment decisions. Please do your own research (DYOR) before participating.
          </p>
        </div>
        
        {/* Branding */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <img src="/favicon.ico" alt="PinTool" className="w-4 h-4" />
            <span>Built by <span className="text-jup-green font-medium">PinTool</span></span>
          </div>
          <p className="text-gray-500 text-xs">
            Not Financial Advice • Use at Your Own Risk
          </p>
        </div>
      </div>
    </footer>
  )
}

