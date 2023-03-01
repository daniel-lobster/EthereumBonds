import { useState , useEffect} from 'react'
const { ethers } = require("ethers");
const contract = require("../TokenLoans.json");


function Investor({
    contract_address, 
    signer_private_key, 
    refresh, 
    setRefresh, 
    clearInvestor,
    setNeedAddress,
    setNeedPrivateKey,
    clearBorrower,
    setClearBorrower,
    clearDeploy,
    setClearDeploy
}) {

    const [buyamount, setBuyAmount] = useState("")
    const [balancetokens, setBalanceTokens] = useState("")
    const [needInvestmentValue, setNeedInvestmentValue] = useState(false)
    
    useEffect(()=>{
        clearInvestorInfo();
        setNeedInvestmentValue(false)
    },[clearInvestor])

    async function clearInvestorInfo() {
        setBuyAmount("")
        setBalanceTokens("")
    }

    function checkCompleteness(){
        setNeedAddress(false)
        setNeedPrivateKey(false)
        if (contract_address==""){
            setNeedAddress(true)
        }
        if (signer_private_key==""){
            setNeedPrivateKey(true)
        }
    }


    async function buy(e) {
        e.preventDefault()
        checkCompleteness()
        setNeedInvestmentValue(false)
        setClearBorrower(!clearBorrower)
        setClearDeploy(!clearDeploy)
        if (buyamount==""){
            setNeedInvestmentValue(true)
        } else {
            // provider - Default Provider
            const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
            // signer - you
            // Wallet("private key", provider)
            const signer = new ethers.Wallet(signer_private_key, provider);
            // contract instance
            // Contract ("contract.address", contract.abi, signer)
            const tokenloans_deployed = new ethers.Contract(contract_address, contract.abi, signer);
            const transaction = await tokenloans_deployed.buyTKL_with_wei({value : ethers.utils.parseEther(buyamount) })
            await transaction.wait()
            setBuyAmount("")
            setRefresh(!refresh)
            balance(e)
        }
    }

    async function balance(e) {
        e.preventDefault()
        setNeedInvestmentValue(false)
        setBuyAmount("")
        checkCompleteness()
        setClearBorrower(!clearBorrower)
        setClearDeploy(!clearDeploy)

        // provider - Default Provider
        const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
        // signer - you
        // Wallet("private key", provider)
        const signer = new ethers.Wallet(signer_private_key, provider);
        // contract instance
        // Contract ("contract.address", contract.abi, signer)
        const tokenloans_deployed = new ethers.Contract(contract_address, contract.abi, signer);
        setBalanceTokens(ethers.utils.formatEther(await tokenloans_deployed.balanceOfSender()));
        setRefresh(!refresh)
    }

    async function withdrawInvestment(){
        // provider - Default Provider
        const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
        // signer - you
        // Wallet("private key", provider)
        const signer = new ethers.Wallet(signer_private_key, provider);
        // contract instance
        // Contract ("contract.address", contract.abi, signer)
        const tokenloans_deployed = new ethers.Contract(contract_address, contract.abi, signer);
        const transaction = await tokenloans_deployed.investor_refund_principal({gasLimit: 50000 });
        await transaction.wait();
        setRefresh(!refresh)
    }

    return (
        <div className = "card rounded-5" style={{padding : "2em", backgroundColor:'#000', borderColor : "white", marginBottom:"2em"}}>
            <h3>Investor</h3>
            <table>
                <tr>
                    <td style = {{width:"51%"}}>
                        <p style={{margin:"0"}}>How much would you like to invest (ETH)?</p>
                    </td>
                    <td style = {{width:"36%"}}>
                        <input type="number" value={buyamount} style={{marginRight : "1em"}} onChange={(e) => setBuyAmount(e.target.value)}/>
                    </td>
                    <td>
                        <button className="btn button" style={{marginBottom : "0"}} onClick={(e) => buy(e)}>Buy</button>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        {needInvestmentValue ? <div style={{height:'1em'}} className="warning">Please include investment value</div>:<div style={{height:'1em'}}></div>} 
                    </td>
                    <td></td>
                </tr>
            </table>
            <div style={{display:'flex', alignItems:"center"}}>
                <button className="btn button" style={{marginRight : "1em"}}onClick={(e) => balance(e)}>How many bonds do I own?</button> 
                <div><p style={{margin:"0"}}> {balancetokens} </p></div>
            </div>
            <button className="btn button" style={{marginBottom:"0", width:"29%"}}onClick={(e) => withdrawInvestment(e)}>Withdraw Investment</button> 
        </div>
    )
}

export default Investor;
