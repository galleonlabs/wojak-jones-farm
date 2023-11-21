import { useEthers } from "@usedapp/core";

const ConnectButton = () => {
  const { account, deactivate, activateBrowserWallet } = useEthers();

  if (account) {
    return <button onClick={() => deactivate()}>Disconnect</button>;
  } else {
    return <button onClick={() => activateBrowserWallet()}>Connect</button>;
  }
};

export default ConnectButton;
