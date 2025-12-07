import { 
  Header, 
  HeroSection, 
  StepsPanel, 
  FlowVisualization, 
  FeatureCards, 
  Footer,
  BackgroundEffects 
} from './components'
import { useWallet } from './hooks/useWallet'

function App() {
  const { 
    walletAddress, 
    isLoading, 
    isSuccess, 
    buttonText, 
    txStatus, 
    execute 
  } = useWallet()

  return (
    <div className="text-white overflow-x-hidden min-h-screen">
      <BackgroundEffects />
      
      <Header walletAddress={walletAddress} />

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-12">
        <HeroSection />

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <StepsPanel 
            isLoading={isLoading}
            isSuccess={isSuccess}
            buttonText={buttonText}
            onExecute={execute}
          />
          <FlowVisualization txStatus={txStatus} />
        </div>

        <FeatureCards />
      </main>

      <Footer />
    </div>
  )
}

export default App


