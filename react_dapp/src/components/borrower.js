import { useState, useEffect} from 'react'
import Deploy from './deploy';
const { ethers } = require("ethers");
const contract = require("../TokenLoans.json");



function Borrower(
    {contract_address, 
    setContractAddress, 
    signer_private_key, 
    refresh, 
    setRefresh, 
    clearBorrower,
    setClearBorrower,
    clearDeploy,
    setClearDeploy,
    clearInvestor,
    setClearInvestor,
    setNeedPrivateKey,
    setNeedAddress
}) {

    const [depositAmount, setDepositAmount] = useState("")
    const [withdrawAmount, setWithdrawAmount] = useState("")
    const [needDepositValue, setNeedDepostValue] = useState(false)
    const [needWithdrawValue, setNeedWithdrawValue] = useState(false)

    useEffect(()=>{
        clearBorrowerInfo();
        clearLocalWarnings();
    },[clearBorrower])

    async function clearBorrowerInfo() {
        setDepositAmount("")
        setWithdrawAmount("")
    }

    function clearLocalWarnings(){
        setNeedDepostValue(false)
        setNeedWithdrawValue(false)
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

    async function depositMakeInvestorsWhole(e) {
        e.preventDefault()
        checkCompleteness()
        clearLocalWarnings()
        setDepositAmount("")
        setWithdrawAmount("")
        setClearDeploy(!clearDeploy)
        setClearInvestor(!clearInvestor)
        // provider - Default Provider
        const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
        // signer - you
        // Wallet("private key", provider)
        const signer = new ethers.Wallet(signer_private_key, provider);
        // contract instance
        // Contract ("contract.address", contract.abi, signer)
        const tokenloans_deployed = new ethers.Contract(contract_address, contract.abi, signer);
        var new_value = ethers.utils.formatEther(await tokenloans_deployed.outanding_tokens_minus_contract_funds());
        const transaction = await tokenloans_deployed.deposit({value : ethers.utils.parseEther(new_value) });
        await transaction.wait();
        setRefresh(!refresh)
    }

    async function deposit(e) {
        e.preventDefault()
        checkCompleteness()
        clearLocalWarnings()
        setWithdrawAmount("")
        setClearDeploy(!clearDeploy)
        setClearInvestor(!clearInvestor)
        if (depositAmount === ""){
            setNeedDepostValue(true);
        } else {
            setNeedDepostValue(false)
            // provider - Default Provider
            const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
            // signer - you
            // Wallet("private key", provider)
            const signer = new ethers.Wallet(signer_private_key, provider);
            // contract instance
            // Contract ("contract.address", contract.abi, signer)
            const tokenloans_deployed = new ethers.Contract(contract_address, contract.abi, signer);
            const wei_in_ether = ethers.BigNumber.from(10).pow(18)
            const deposit_amount_bignumber = ethers.BigNumber.from(depositAmount).mul(wei_in_ether)
            const transaction = await tokenloans_deployed.deposit({value : ethers.utils.parseEther(depositAmount), gasLimit: 50000 });
            await transaction.wait();
            setRefresh(!refresh)
            setDepositAmount("")
        }
    }

    async function makeMonthlyPayment(e) {
        e.preventDefault()
        checkCompleteness()
        clearLocalWarnings()
        clearBorrowerInfo()
        setClearDeploy(!clearDeploy)
        setClearInvestor(!clearInvestor)
        // provider - Default Provider
        const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
        // signer - you
        // Wallet("private key", provider)
        const signer = new ethers.Wallet(signer_private_key, provider);
        // contract instance
        // Contract ("contract.address", contract.abi, signer)
        const tokenloans_deployed = new ethers.Contract(contract_address, contract.abi, signer);
        const transaction = await tokenloans_deployed.makeMonthlyPayment();
        await transaction.wait();
        setRefresh(!refresh)
    }

    async function withdrawAllFunds(e) {
        e.preventDefault()
        checkCompleteness()
        clearLocalWarnings()
        clearBorrowerInfo()
        setClearDeploy(!clearDeploy)
        setClearInvestor(!clearInvestor)
        // provider - Default Provider
        const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
        // signer - you
        // Wallet("private key", provider)
        const signer = new ethers.Wallet(signer_private_key, provider);
        // contract instance
        // Contract ("contract.address", contract.abi, signer)
        const tokenloans_deployed = new ethers.Contract(contract_address, contract.abi, signer);
        let totalContractFundsinWei_bignumber =ethers.BigNumber.from(await tokenloans_deployed.totalContractFundsinWei())
        console.log('begining')
        console.log(await tokenloans_deployed.totalContractFundsinWei())
        console.log(totalContractFundsinWei_bignumber)
        console.log('end')
        const transaction = await tokenloans_deployed.withdraw_funds(totalContractFundsinWei_bignumber);
        await transaction.wait();
        setRefresh(!refresh)
    }

    async function withdraw(e) {
        e.preventDefault()
        checkCompleteness()
        clearLocalWarnings()
        setDepositAmount("")
        setClearDeploy(!clearDeploy)
        setClearInvestor(!clearInvestor)
        if (withdrawAmount === ""){
            setNeedWithdrawValue(true);
        } else {
            setNeedWithdrawValue(false)
            // provider - Default Provider
            const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
            // signer - you
            // Wallet("private key", provider)
            const signer = new ethers.Wallet(signer_private_key, provider);
            // contract instance
            // Contract ("contract.address", contract.abi, signer)
            const tokenloans_deployed = new ethers.Contract(contract_address, contract.abi, signer);
            console.log(withdrawAmount)
            console.log(ethers.utils.parseEther(withdrawAmount))
            const transaction = await tokenloans_deployed.withdraw_funds(ethers.utils.parseEther(withdrawAmount));
            await transaction.wait();
            setRefresh(!refresh)
            setWithdrawAmount("")
        }
        
    }

    async function returnPrincipal(){
        const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
        // signer - you
        // Wallet("private key", provider)
        const signer = new ethers.Wallet(signer_private_key, provider);
        // contract instance
        // Contract ("contract.address", contract.abi, signer)
        const tokenloans_deployed = new ethers.Contract(contract_address, contract.abi, signer);
        const transaction = await tokenloans_deployed.owner_refund_principal({gasLimit: 1000000 });
        await transaction.wait();
    }



    return (
        <div className = "card rounded-5 " style={{padding : "2em", backgroundColor:'#000', borderColor : "white" }}>
            <h3 style={{marginBottom:"1em"}}>Borrower</h3>
            {/* <button className="btn button" style ={{width:"63%"}} onClick={(e) => returnPrincipal(e)}>Return Principal Before Fundraising Ends</button> */}
            <button className="btn button" style ={{width:"64%"}} onClick={(e) => depositMakeInvestorsWhole(e)}>Deposit Enough to Make Investors Whole</button>
            <table className="mb-3">
                <tr>
                    <td style = {{width:"23%"}}>
                        <button className="btn button" style ={{marginBottom:"0"}}onClick={(e) => deposit(e)}>Deposit</button>
                    </td>
                    <td style = {{width:"45%"}}>
                        <input type="number" value={depositAmount} onChange={(e) => setDepositAmount((e.target.value))}/>
                    </td>
                    <td>
                        <p style={{marginBottom:"0"}}>(ETH)</p>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        {needDepositValue ? <div style={{height:'1em'}} className="warning">Please include a deposit value</div>:<div style={{height:'1em'}}></div>}
                    </td>
                    <td></td>
                </tr>
            </table>
            <button className="btn button" style ={{width:"39%"}} onClick={(e) => makeMonthlyPayment(e)}>Make Monthly Payment</button>
            <button className="btn button" style ={{width:"33%"}} onClick={(e) => withdrawAllFunds(e)}>Withdraw all Funds</button>
            <table className="mb-3">
                <tr>
                    <td style = {{width:"23%"}}>
                        <button className="btn button" style ={{marginBottom:"0"}} onClick={(e) => withdraw(e)}>Withdraw</button>
                    </td>
                    <td style = {{width:"45%"}}>
                        <input type="number" value={withdrawAmount} onChange={(e) => setWithdrawAmount((e.target.value))}/>
                    </td>
                    <td>
                        <p style={{marginBottom:"0"}}>(ETH)</p>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        {needWithdrawValue ? <div style={{height:'1em'}} className="warning">Please include a withdraw value</div>:<div style={{height:'1em'}}></div>} 
                    </td>
                    <td></td>
                </tr>

            </table>
            <Deploy 
                setContractAddress={setContractAddress} 
                signer_private_key={signer_private_key} 
                refresh={refresh} 
                setRefresh={setRefresh} 
                clearDeploy={clearDeploy}
                clearBorrower={clearBorrower}
                setClearBorrower={setClearBorrower}
                clearInvestor={clearInvestor}
                setClearInvestor={setClearInvestor}
                setNeedPrivateKey={setNeedPrivateKey}
                setNeedAddress = {setNeedAddress}
            />
        </div>
    )
}

export default Borrower;
