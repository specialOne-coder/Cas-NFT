import abi from './abis/goerli.json'

export const chainlist = [
  {
    id: 0,
    chainid: '0x5',
    chain_name: 'Goerli Testnet',
    rpc: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
    abi: abi.abi,
    address: '0xE38C569404181Cdc7706Fd33b4B44abFffFb3207', // to change
    explorer: 'https://goerli.etherscan.io',
  },
  {
    id: 1,
    chainid: '0x1',
    chain_name: 'Ethereum',
    rpc: 'https://rpc-mumbai.matic.today',
    abi: abi.abi,
    address: '0x106b6695Aa830b7ff4dEc94095aDC11c4f4CCfB1', // to change
    explorer: 'https://mumbai.polygonscan.com',
  },
  {
    id: 2,
    chainid: '0x137',
    chain_name: 'Polygon',
    rpc: 'https://poly-rpc.gateway.pokt.network',
    abi: 'import your abi here',
    address: '0X0000000000000000000000000000000000000000',
  },
  {
    id: 3,
    chainid: '0x43114',
    chain_name: 'Avax',
    rpc: 'https://rpc.ankr.com/avalanche',
    abi: 'import your abi here',
    address: '0X0000000000000000000000000000000000000000',
  },
  {
    id: 4,
    chainid: '0x56',
    chain_name: 'BNB',
    rpc: 'https://bsc-dataseed4.defibit.io',
    abi: 'import your abi here',
    address: '0X0000000000000000000000000000000000000000',
  },
  {
    id: 5,
    chainid: '0x250',
    chain_name: 'Fantom',
    rpc: 'https://rpc.fantom.network',
    abi: 'import your abi here',
    address: '0X0000000000000000000000000000000000000000',
  },
  {
    id: 6,
    chainid: '0x42161',
    chain_name: 'Arbitrum',
    rpc: 'https://rpc.ankr.com/arbitrum',
    abi: 'import your abi here',
    address: '0X0000000000000000000000000000000000000000',
  },
  {
    id: 10,
    chainid: '0x10',
    chain_name: 'Optimism',
    rpc: 'https://mainnet.optimism.io',
    abi: 'import your abi here',
    address: '0X0000000000000000000000000000000000000000',
  },
]
