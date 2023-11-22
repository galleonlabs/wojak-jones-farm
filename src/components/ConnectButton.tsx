import { useEthers } from "@usedapp/core";

const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers();

  if (account) {
    return <button className="border-2  border-gray-600 text-2xl px-2 rounded-sm bg-theme-1 hover:bg-theme-3 justify-center text-center inline-flex mx-auto" onClick={() => deactivate()}>Disconnect</button>;
  } else {
    return <button className="border-2 border-gray-600 text-2xl px-2 rounded-sm bg-theme-3 hover:bg-theme-1 justify-center text-center inline-flex mx-auto" onClick={() => activateBrowserWallet()}>Connect</button>;
  }
};

export default ConnectButton;
