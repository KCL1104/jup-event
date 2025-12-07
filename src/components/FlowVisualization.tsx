import { GitBranch, Wallet, Cpu, Flag } from 'lucide-react'

interface FlowVisualizationProps {
  txStatus: string
}

export function FlowVisualization({ txStatus }: FlowVisualizationProps) {
  return (
    <div className="glass-panel rounded-3xl p-8 lg:p-10 min-h-[600px] relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-jup-green/10 flex items-center justify-center">
            <GitBranch className="w-6 h-6 text-jup-green" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">Transaction Flow</h2>
            <p className="text-gray-500 text-sm">Visual representation</p>
          </div>
        </div>
        <div className="status-badge bg-emerald-500/10 text-emerald-400 px-3 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-1">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Ready
        </div>
      </div>

      {/* SVG Flow Diagram */}
      <div className="relative h-[450px]">
        <svg 
          className="absolute inset-0 w-full h-full" 
          viewBox="0 0 400 400" 
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Connection Lines */}
          <path 
            className="connecting-line" 
            d="M 200 80 L 200 140" 
            stroke="#C7F284" 
            strokeWidth="2" 
            fill="none" 
            opacity="0.5"
          />
          <path 
            className="connecting-line" 
            d="M 200 200 L 100 280" 
            stroke="#C7F284" 
            strokeWidth="2" 
            fill="none" 
            opacity="0.5" 
            style={{ animationDelay: '-0.3s' }}
          />
          <path 
            className="connecting-line" 
            d="M 200 200 L 300 280" 
            stroke="#C7F284" 
            strokeWidth="2" 
            fill="none" 
            opacity="0.5" 
            style={{ animationDelay: '-0.6s' }}
          />
          <path 
            className="connecting-line" 
            d="M 100 340 L 200 380" 
            stroke="#C7F284" 
            strokeWidth="2" 
            fill="none" 
            opacity="0.3"
          />
          <path 
            className="connecting-line" 
            d="M 300 340 L 200 380" 
            stroke="#C7F284" 
            strokeWidth="2" 
            fill="none" 
            opacity="0.3"
          />
        </svg>

        {/* User Wallet */}
        <div className="visual-node absolute top-0 left-1/2 -translate-x-1/2 w-32 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 flex items-center justify-center mb-2 shadow-lg">
            <Wallet className="w-7 h-7 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-300">Your Wallet</span>
          <span className="block text-[10px] text-gray-500 font-mono">USDC Balance</span>
        </div>

        {/* Hedging Engine (Center) */}
        <div className="visual-node absolute top-[140px] left-1/2 -translate-x-1/2 w-44">
          <div className="animate-pulse-glow bg-gradient-to-br from-[#1a2332] to-[#0f172a] rounded-2xl p-4 border border-jup-green/30 text-center shadow-xl">
            <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-jup-green to-jup-green-dark flex items-center justify-center mb-2">
              <Cpu className="w-6 h-6 text-jup-dark" />
            </div>
            <span className="text-sm font-bold text-white block">Hedging Engine</span>
            <span className="text-[10px] text-jup-green font-mono">Jito Bundle</span>
          </div>
        </div>

        {/* Jupiter Swap (Left) */}
        <div className="visual-node absolute top-[280px] left-[10%] w-36 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-black border border-gray-700 flex items-center justify-center mb-2 shadow-lg overflow-hidden">
            <img src="/jupiter.svg" alt="Jupiter" className="w-10 h-10" />
          </div>
          <span className="text-sm font-medium text-gray-300">Jupiter Swap</span>
          <span className="block text-[10px] text-yellow-400 font-mono">USDC → JUP</span>
        </div>

        {/* Drift Protocol (Right) */}
        <div className="visual-node absolute top-[280px] right-[10%] w-36 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-black border border-gray-700 flex items-center justify-center mb-2 shadow-lg overflow-hidden">
            <img src="/drift.svg" alt="Drift" className="w-10 h-10" />
          </div>
          <span className="text-sm font-medium text-gray-300">Drift Protocol</span>
          <span className="block text-[10px] text-purple-400 font-mono">1x Short JUP-PERP</span>
        </div>

        {/* Event Wallet (Bottom) */}
        <div className="visual-node absolute bottom-0 left-1/2 -translate-x-1/2 w-40 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-jup-green to-jup-green-dark border border-jup-green/50 flex items-center justify-center mb-2 shadow-lg shadow-jup-green/20">
            <Flag className="w-7 h-7 text-jup-dark" />
          </div>
          <span className="text-sm font-bold text-white">Event Wallet</span>
          <span className="block text-[10px] text-jup-green font-mono">Receive Hedged JUP</span>
        </div>
      </div>

      {/* Bottom Status */}
      <div className="absolute bottom-6 left-6 right-6">
        <div className="bg-gray-900/80 rounded-xl p-4 border border-gray-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-400">Transaction Status</span>
            <span className="font-mono text-jup-green">{txStatus}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

