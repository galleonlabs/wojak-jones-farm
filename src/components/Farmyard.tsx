import { useEthers } from "@usedapp/core";
import { useEffect } from "react";
import ConnectButton from "./ConnectButton";
import useSignText from "../hooks/useSignText";


const Farmyard = () => {
  const { account } = useEthers();
  const signText = useSignText();

  useEffect(() => {
    if (!account) return;


  }, [account]);

  return (
    <>
      <ConnectButton />
      <div onClick={() => signText('Testing Signature')}>Sign Test Message</div>
      <div>Farmyard</div>
     
    </>
  );
};

export default Farmyard;
