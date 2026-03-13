import React, { useEffect, useState } from 'react'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { web3Enable, web3Accounts, web3FromSource, web3FromAddress } from '@polkadot/extension-dapp'
import { decodeAddress } from '@polkadot/util-crypto'
import { Web3Storage } from 'web3.storage'
import { Keyring } from '@polkadot/keyring'
import { PolkadotBridgeClient } from '../utils/polkadot-bridge-client'

function PolkadotInfo() {
  const [status, setStatus] = useState<'connecting' | 'connected' | 'error'>('connecting')
  const [chain, setChain] = useState<string>('')
  const [block, setBlock] = useState<number>(0)
  const [finalBlock, setFinalBlock] = useState<number>(0)
  const [api, setApi] = useState<ApiPromise | null>(null)
  const [endpoint, setEndpoint] = useState<string>('wss://rpc.polkadot.io')
  const [extReady, setExtReady] = useState(false)
  const [extError, setExtError] = useState<string>('')
  const [injectedNames, setInjectedNames] = useState<string[]>([])
  const [accounts, setAccounts] = useState<Array<{ address: string; meta: any }>>([])
  const [active, setActive] = useState<{ address: string; meta: any } | null>(null)
  const [devPair, setDevPair] = useState<any | null>(null)
  const [mnemonic, setMnemonic] = useState<string>('')
  const [balance, setBalance] = useState<string>('0')
  const [remark, setRemark] = useState<string>('hello from creative engine')
  const [txStatus, setTxStatus] = useState<string>('')
  const [txInBlock, setTxInBlock] = useState<string>('')
  const [txFinalized, setTxFinalized] = useState<string>('')
  const [txError, setTxError] = useState<string>('')
  const [decimals, setDecimals] = useState<number>(10)
  const [tokenSymbol, setTokenSymbol] = useState<string>('DOT')
  const [remarkFeeRaw, setRemarkFeeRaw] = useState<string>('')
  const [remarkFee, setRemarkFee] = useState<string>('')
  const [healthPeers, setHealthPeers] = useState<number>(0)
  const [healthSyncing, setHealthSyncing] = useState<boolean>(false)
  const [runtimeSpec, setRuntimeSpec] = useState<string>('')
  const [palletCount, setPalletCount] = useState<number>(0)
  const [querySs58, setQuerySs58] = useState<string>('')
  const [accountJson, setAccountJson] = useState<any>(null)
  const [transferDest, setTransferDest] = useState<string>('')
  const [transferAmount, setTransferAmount] = useState<string>('0')
  const [transferStatus, setTransferStatus] = useState<string>('')
  const [transferInBlock, setTransferInBlock] = useState<string>('')
  const [transferFinalized, setTransferFinalized] = useState<string>('')
  const [transferError, setTransferError] = useState<string>('')
  const [transferFeeRaw, setTransferFeeRaw] = useState<string>('')
  const [transferFee, setTransferFee] = useState<string>('')
  const [apiKey, setApiKey] = useState<string>('')
  const [nftName, setNftName] = useState<string>('Creative NFT')
  const [nftDesc, setNftDesc] = useState<string>('Generated with creative engine')
  const [nftImage, setNftImage] = useState<File | null>(null)
  const [nftStatus, setNftStatus] = useState<string>('')
  const [nftCid, setNftCid] = useState<string>('')
  const [nftUrl, setNftUrl] = useState<string>('')
  
  // Bridge State
  const [bridgeClient] = useState(new PolkadotBridgeClient())
  const [evmAccount, setEvmAccount] = useState<string | null>(null)
  const [streamId, setStreamId] = useState<string>('')
  const [targetChain, setTargetChain] = useState<string>('filecoin')
  const [ipfsHash, setIpfsHash] = useState<string>('')
  const [bridgeStatus, setBridgeStatus] = useState<string>('')

  useEffect(() => {
    let unsub: any
    let unsubFinal: any
    let destroyed = false
    const connectChain = async () => {
      try {
        setStatus('connecting')
        const provider = new WsProvider(endpoint)
        const apiInst = await ApiPromise.create({ provider })
        if (destroyed) return
        setApi(apiInst)
        const decs = apiInst.registry.chainDecimals?.[0]
        const toks = apiInst.registry.chainTokens?.[0]
        if (typeof decs === 'number') setDecimals(decs)
        if (typeof toks === 'string') setTokenSymbol(toks)
        const systemChain = await apiInst.rpc.system.chain()
        setChain(systemChain.toString())
        try {
          const health: any = await apiInst.rpc.system.health()
          setHealthPeers((health.peers as any)?.toNumber?.() || Number(health.peers) || 0)
          setHealthSyncing(!!(health.isSyncing as any))
        } catch { }
        try {
          const rv: any = await apiInst.rpc.state.getRuntimeVersion()
          setRuntimeSpec(rv?.specVersion?.toString?.() || rv?.specVersion || '')
        } catch { }
        try {
          const metaAny: any = (apiInst as any).runtimeMetadata
          const plc = metaAny?.asLatest?.pallets?.length || 0
          setPalletCount(plc)
        } catch { }
        setStatus('connected')
        unsub = await apiInst.rpc.chain.subscribeNewHeads((header) => {
          setBlock(header.number.toNumber())
        })
        unsubFinal = await apiInst.rpc.chain.subscribeFinalizedHeads((header) => {
          setFinalBlock(header.number.toNumber())
        })
      } catch (e) {
        setStatus('error')
      }
    }
    connectChain()
    return () => {
      destroyed = true
      if (typeof unsub === 'function') unsub()
      if (typeof unsubFinal === 'function') unsubFinal()
    }
  }, [endpoint])
  const formatUnits = (amountStr: string) => {
    try {
      const n = BigInt(amountStr || '0')
      const base = BigInt(10) ** BigInt(decimals || 10)
      const whole = n / base
      const frac = n % base
      const fracStr = frac.toString().padStart(decimals || 10, '0').slice(0, 4)
      return `${whole.toString()}.${fracStr} ${tokenSymbol}`
    } catch {
      return `${amountStr} plancks`
    }
  }
  const connectExtension = async () => {
    setTxStatus('')
    setExtError('')
    setTxError('')
    const injected = await web3Enable('Creative Engine Polkadot')
    if (!injected || injected.length === 0) {
      setExtReady(false)
      setExtError('No Polkadot{.js} extension found. Please install it.')
      return
    }
    setExtReady(true)
    const allAccounts = await web3Accounts()
    setAccounts(allAccounts)
    if (allAccounts.length > 0) {
      setActive(allAccounts[0])
    }
  }
  const createDevWallet = () => {
    const keyring = new Keyring({ type: 'sr25519' })
    const newPair = keyring.addFromUri('//Alice')
    setDevPair(newPair)
    setActive({ address: newPair.address, meta: { name: 'Alice (dev)', source: 'dev' } })
  }
  const createWalletFromMnemonic = () => {
    try {
      const keyring = new Keyring({ type: 'sr25519' })
      const newPair = keyring.addFromUri(mnemonic)
      setDevPair(newPair)
      setActive({ address: newPair.address, meta: { name: 'Custom (dev)', source: 'dev' } })
      setMnemonic('')
    } catch (e: any) {
      alert(`Error creating wallet: ${e.message}`)
    }
  }
  const getBalance = async () => {
    if (!api || !active) return
    const { data: balanceData } = await api.query.system.account(active.address)
    setBalance(balanceData.free.toString())
  }
  const signAndSendRemark = async () => {
    if (!api || !active) return
    setTxStatus('signing')
    setTxInBlock('')
    setTxFinalized('')
    setTxError('')
    try {
      const injector = await web3FromAddress(active.address)
      const tx = api.tx.system.remark(remark)
      const paymentInfo = await tx.paymentInfo(active.address)
      setRemarkFeeRaw(paymentInfo.partialFee.toString())
      setRemarkFee(formatUnits(paymentInfo.partialFee.toString()))
      const unsub = await tx.signAndSend(active.address, { signer: injector.signer }, (result) => {
        if (result.status.isInBlock) {
          setTxInBlock(result.status.asInBlock.toHex())
          setTxStatus('inBlock')
        } else if (result.status.isFinalized) {
          setTxFinalized(result.status.asFinalized.toHex())
          setTxStatus('finalized')
          unsub()
        }
      })
    } catch (e: any) {
      setTxError(e.message)
      setTxStatus('error')
    }
  }
  const queryAccount = async () => {
    if (!api || !querySs58) return
    try {
      const publicKey = decodeAddress(querySs58)
      const hexAddress = `0x${Buffer.from(publicKey).toString('hex')}`
      const { data: balanceData } = await api.query.system.account(querySs58)
      setAccountJson({
        address: querySs58,
        hexAddress: hexAddress,
        balance: formatUnits(balanceData.free.toString()),
        nonce: balanceData.nonce.toNumber(),
        consumers: balanceData.consumers.toNumber(),
        providers: balanceData.providers.toNumber(),
        sufficients: balanceData.sufficients.toNumber(),
      })
    } catch (e: any) {
      setAccountJson({ error: e.message })
    }
  }
  const transferTokens = async () => {
    if (!api || !active || !transferDest || !transferAmount) return
    setTransferStatus('signing')
    setTransferInBlock('')
    setTransferFinalized('')
    setTransferError('')
    try {
      const injector = await web3FromAddress(active.address)
      const amount = parseFloat(transferAmount) * (10 ** decimals)
      const tx = api.tx.balances.transfer(transferDest, amount)
      const paymentInfo = await tx.paymentInfo(active.address)
      setTransferFeeRaw(paymentInfo.partialFee.toString())
      setTransferFee(formatUnits(paymentInfo.partialFee.toString()))
      const unsub = await tx.signAndSend(active.address, { signer: injector.signer }, (result) => {
        if (result.status.isInBlock) {
          setTransferInBlock(result.status.asInBlock.toHex())
          setTransferStatus('inBlock')
        } else if (result.status.isFinalized) {
          setTransferFinalized(result.status.asFinalized.toHex())
          setTransferStatus('finalized')
          unsub()
        }
      })
    } catch (e: any) {
      setTransferError(e.message)
      setTransferStatus('error')
    }
  }
  const uploadToWeb3Storage = async () => {
    if (!apiKey || !nftImage) {
      alert('Please provide Web3.Storage API Key and select an image.')
      return
    }
    setNftStatus('uploading')
    try {
      const client = new Web3Storage({ token: apiKey })
      const cid = await client.put([nftImage], {
        name: nftImage.name,
        maxRetries: 3,
      })
      setNftCid(cid)
      setNftUrl(`https://${cid}.ipfs.dweb.link/${nftImage.name}`)
      setNftStatus('uploaded')
    } catch (e: any) {
      setNftStatus('error')
      alert(`Upload failed: ${e.message}`)
    }
  }

  const connectEVM = async () => {
    try {
        setBridgeStatus('Connecting to MetaMask...')
        const account = await bridgeClient.connect()
        if (account) {
            setEvmAccount(account)
            setBridgeStatus('Connected to Moonbase Alpha')
        } else {
            setBridgeStatus('Failed to connect: No account returned')
        }
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e)
        setBridgeStatus(`Error: ${errorMessage}`)
        console.error('MetaMask connection error:', e)
    }
  }

  const handleCreateDataStream = async () => {
    if (!evmAccount || !streamId || !ipfsHash) {
        setBridgeStatus('Please fill all fields and connect wallet')
        return
    }
    try {
        setBridgeStatus('Creating data stream on Moonbase Alpha...')
        const tx = await bridgeClient.createDataStream(streamId, targetChain, ipfsHash)
        if (tx) {
            setBridgeStatus(`Stream Created! Tx: ${tx}`)
        } else {
            setBridgeStatus('Failed to create stream: No transaction returned. Check console for details.')
        }
    } catch (e: unknown) {
        const errorMessage = e instanceof Error ? e.message : String(e)
        setBridgeStatus(`Error creating stream: ${errorMessage}`)
        console.error('Create stream error:', e)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center text-purple-400">Polkadot Integration & NFT Minting</h1>

        {/* Connection Status */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Chain Connection</h2>
          <div className="flex items-center gap-4 mb-4">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${status === 'connected' ? 'bg-green-600' : status === 'connecting' ? 'bg-yellow-600' : 'bg-red-600'}`}>
              {status.toUpperCase()}
            </span>
            <span className="text-gray-300">Chain: {chain || 'N/A'}</span>
            <span className="text-gray-300">Block: {block} (Finalized: {finalBlock})</span>
            <span className="text-gray-300">Runtime: {runtimeSpec}</span>
            <span className="text-gray-300">Pallets: {palletCount}</span>
            <span className="text-gray-300">Peers: {healthPeers}</span>
            <span className="text-gray-300">Syncing: {healthSyncing ? 'Yes' : 'No'}</span>
          </div>
          <div className="flex items-center gap-4">
            <label className="text-gray-300">Endpoint:</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="flex-grow px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Wallet & Accounts */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Wallet & Accounts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <button
                onClick={connectExtension}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-md transition-colors mb-2"
              >
                Connect Polkadot.js Extension
              </button>
              {!extReady && extError && (
                <p className="text-red-400 text-sm mt-2">{extError}</p>
              )}
              {extReady && accounts.length === 0 && (
                <p className="text-yellow-400 text-sm mt-2">No accounts found in extension. Please create one.</p>
              )}
              {extReady && accounts.length > 0 && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">Select Account</label>
                  <select
                    onChange={(e) => setActive(accounts.find(acc => acc.address === e.target.value) || null)}
                    value={active?.address || ''}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    {accounts.map(acc => (
                      <option key={acc.address} value={acc.address}>
                        {acc.meta.name || acc.address} ({acc.meta.source})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            <div>
              <button
                onClick={createDevWallet}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors mb-2"
              >
                Create Dev Wallet (Alice)
              </button>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Mnemonic (for custom dev wallet)</label>
                <input
                  type="text"
                  value={mnemonic}
                  onChange={(e) => setMnemonic(e.target.value)}
                  placeholder="Enter 12-word mnemonic"
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
                />
                <button
                  onClick={createWalletFromMnemonic}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Create Custom Dev Wallet
                </button>
              </div>
            </div>
          </div>
          {active && (
            <div className="mt-6 bg-gray-700 rounded-md p-4">
              <p className="text-lg font-medium text-purple-200">Active Account:</p>
              <p className="text-sm text-gray-300 break-all">Address: {active.address}</p>
              <p className="text-sm text-gray-300">Name: {active.meta.name || 'N/A'}</p>
              <p className="text-sm text-gray-300">Source: {active.meta.source || 'N/A'}</p>
              <button
                onClick={getBalance}
                className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-1 px-3 rounded-md transition-colors"
              >
                Get Balance
              </button>
              <p className="text-sm text-gray-300 mt-2">Balance: {formatUnits(balance)}</p>
            </div>
          )}
        </div>

        {/* System Remark */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">System Remark (On-chain Message)</h2>
          <textarea
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
            rows={3}
          ></textarea>
          <button
            onClick={signAndSendRemark}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={!api || !active || txStatus === 'signing'}
          >
            {txStatus === 'signing' ? 'Signing...' : 'Sign & Send Remark'}
          </button>
          {txStatus && (
            <div className="mt-4 text-sm">
              <p className="text-gray-300">Status: {txStatus}</p>
              {txInBlock && <p className="text-gray-300 break-all">In Block: {txInBlock}</p>}
              {txFinalized && <p className="text-gray-300 break-all">Finalized: {txFinalized}</p>}
              {txError && <p className="text-red-400 break-all">Error: {txError}</p>}
              {remarkFee && <p className="text-gray-300">Fee: {remarkFee}</p>}
            </div>
          )}
        </div>

        {/* Account Query */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Query Account Info</h2>
          <input
            type="text"
            value={querySs58}
            onChange={(e) => setQuerySs58(e.target.value)}
            placeholder="Enter SS58 address to query"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          />
          <button
            onClick={queryAccount}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={!api || !querySs58}
          >
            Query Account
          </button>
          {accountJson && (
            <pre className="mt-4 bg-gray-700 p-3 rounded-md text-sm overflow-x-auto">
              {JSON.stringify(accountJson, null, 2)}
            </pre>
          )}
        </div>

        {/* Token Transfer */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Token Transfer</h2>
          <input
            type="text"
            value={transferDest}
            onChange={(e) => setTransferDest(e.target.value)}
            placeholder="Recipient SS58 Address"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
          />
          <input
            type="number"
            value={transferAmount}
            onChange={(e) => setTransferAmount(e.target.value)}
            placeholder="Amount"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
          />
          <button
            onClick={transferTokens}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={!api || !active || !transferDest || !transferAmount || transferStatus === 'signing'}
          >
            {transferStatus === 'signing' ? 'Transferring...' : 'Transfer Tokens'}
          </button>
          {transferStatus && (
            <div className="mt-4 text-sm">
              <p className="text-gray-300">Status: {transferStatus}</p>
              {transferInBlock && <p className="text-gray-300 break-all">In Block: {transferInBlock}</p>}
              {transferFinalized && <p className="text-gray-300 break-all">Finalized: {transferFinalized}</p>}
              {transferError && <p className="text-red-400 break-all">Error: {transferError}</p>}
              {transferFee && <p className="text-gray-300">Fee: {transferFee}</p>}
            </div>
          )}
        </div>

        {/* Web3.Storage NFT Upload */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Web3.Storage NFT Upload (IPFS)</h2>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Web3.Storage API Key"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
          />
          <input
            type="text"
            value={nftName}
            onChange={(e) => setNftName(e.target.value)}
            placeholder="NFT Name"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
          />
          <textarea
            value={nftDesc}
            onChange={(e) => setNftDesc(e.target.value)}
            placeholder="NFT Description"
            className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500 mb-2"
            rows={2}
          ></textarea>
          <input
            type="file"
            onChange={(e) => e.target.files && setNftImage(e.target.files[0])}
            className="w-full text-white mb-4"
          />
          <button
            onClick={uploadToWeb3Storage}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
            disabled={!apiKey || !nftImage || nftStatus === 'uploading'}
          >
            {nftStatus === 'uploading' ? 'Uploading...' : 'Upload NFT to IPFS'}
          </button>
          {nftStatus && (
            <div className="mt-4 text-sm">
              <p className="text-gray-300">Status: {nftStatus}</p>
              {nftCid && <p className="text-gray-300 break-all">CID: {nftCid}</p>}
              {nftUrl && <p className="text-gray-300 break-all">URL: <a href={nftUrl} target="_blank" rel="noopener noreferrer" className="text-purple-400 underline">{nftUrl}</a></p>}
            </div>
          )}
        </div>

        {/* Cross-Chain Bridge (Moonbeam) */}
        <div className="bg-gray-800 rounded-lg p-6 mb-8 shadow-lg border border-purple-900">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300">Cross-Chain Data Stream (Moonbase Alpha)</h2>
          <div className="mb-4">
            {!evmAccount ? (
                <button
                    onClick={connectEVM}
                    className="bg-orange-600 hover:bg-orange-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
                >
                    Connect MetaMask (EVM)
                </button>
            ) : (
                <p className="text-green-400">Connected: {evmAccount}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
                <label className="block text-gray-400 text-sm mb-1">Stream ID</label>
                <input
                    type="text"
                    value={streamId}
                    onChange={(e) => setStreamId(e.target.value)}
                    placeholder="e.g. bio-stream-001"
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
            </div>
            <div>
                <label className="block text-gray-400 text-sm mb-1">Target Chain</label>
                <select
                    value={targetChain}
                    onChange={(e) => setTargetChain(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                    <option value="filecoin">Filecoin (Calibration)</option>
                    <option value="solana">Solana (Devnet)</option>
                </select>
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-gray-400 text-sm mb-1">IPFS Hash (Payload)</label>
            <input
                type="text"
                value={ipfsHash}
                onChange={(e) => setIpfsHash(e.target.value)}
                placeholder="Qm..."
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <button
            onClick={handleCreateDataStream}
            disabled={!evmAccount || !streamId || !ipfsHash}
            className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Data Stream
          </button>
          
          {bridgeStatus && (
            <div className="mt-4 p-3 bg-black/30 rounded border border-gray-700 text-sm font-mono text-yellow-300">
                {bridgeStatus}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default PolkadotInfo
