import { useState , useEffect} from 'react'
const { ethers } = require("ethers");
const contract = require("../TokenLoans.json");

function ContractInfo({
    contract_address, 
    signer_private_key, 
    refresh, 
    setRefresh, 
    clearContractInfo, 
    setNeedAddress, 
    setNeedPrivateKey,
    clearBorrower,
    setClearBorrower,
    clearDeploy,
    setClearDeploy,
    clearInvestor,
    setClearInvestor
}) {

    useEffect(()=>{
        queryContract();
    },[refresh])

    useEffect(()=>{
        clearInfo();
    },[clearContractInfo])

    const [owners_address, setOwnerAddress] = useState("")
    const [discountedpricefor1000TKL, setDiscountedPriceFor1000TKL] = useState("")
    const [maturityinmonths, setMaturityInMonths] = useState("")
    const [tfundraisingended, setTfundraisingended] = useState("")
    const [fundraisinggoal, setFundraisingGoal] = useState("")
    const [contractfunds, setContractFunds] = useState("")
    const [tokenssold, setTokensSold] = useState("")
    const [outstandingtokensminuscontractfunds, setOutstandingTokensMinusContractFunds] = useState("")
    const [tdeploy, setTdeploy] = useState("")
    const [tpayment, setTpayment] = useState("")
    const [percentagepaidtoinvestors, setPercentagePaidtoInvestors] = useState("")
    const [contractendedsuccessfully, setContractEndedSuccessfully] = useState("")
    const [fundraising_days, setFundraisingDays] = useState("")
    const [grace_period_months, setGracePeriodMonths] = useState("")

    async function clearInfo(){
        setOwnerAddress("")
        setDiscountedPriceFor1000TKL("")
        setMaturityInMonths("")
        setTfundraisingended("")
        setFundraisingGoal("")
        setContractFunds("")
        setTokensSold("")
        setOutstandingTokensMinusContractFunds("")
        setTdeploy("")
        setTpayment("")
        setPercentagePaidtoInvestors("")
        setContractEndedSuccessfully("")
        setFundraisingDays("")
        setGracePeriodMonths("")
    }
    
    async function queryContract(){
        const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
        // signer - you
        // Wallet("private key", provider)
        const signer = new ethers.Wallet(signer_private_key, provider);
        // contract instance
        // Contract ("contract.address", contract.abi, signer)
        const tokenloans_deployed = new ethers.Contract(contract_address, contract.abi, signer);
        setOwnerAddress( await tokenloans_deployed.owner())
        let return_object = await tokenloans_deployed.discounted_price_for_1000TKL()
        setDiscountedPriceFor1000TKL(parseInt(return_object._hex))
        return_object = await tokenloans_deployed.maturity_in_months()
        setMaturityInMonths(parseInt(return_object._hex))
        //setFundraisingEnded(await tokenloans_deployed.fundraising_ended())
        setFundraisingGoal(ethers.utils.formatEther(await tokenloans_deployed.fundraising_goal_in_wei()))
        setContractFunds(ethers.utils.formatEther(await tokenloans_deployed.totalContractFundsinWei()))
        setTokensSold(ethers.utils.formatEther(await tokenloans_deployed.totalSupply()))
        setOutstandingTokensMinusContractFunds(ethers.utils.formatEther(await tokenloans_deployed.outanding_tokens_minus_contract_funds()))
        var time_deployment = new Date( await tokenloans_deployed.time_contract_deployment() *1000);
        setTdeploy(time_deployment.toLocaleString());
        if (await tokenloans_deployed.time_payment_ended() ==0 ){
            setTpayment("N/A");
        } else {
            var time_payment_ended = new Date( await tokenloans_deployed.time_payment_ended() *1000);
            setTpayment(time_payment_ended.toLocaleString());
        }
        return_object =await tokenloans_deployed.percentage_paid_to_investors()
        setPercentagePaidtoInvestors(parseInt(return_object._hex))
        setContractEndedSuccessfully(await tokenloans_deployed.contract_ended_successfully())
        return_object = await tokenloans_deployed.number_of_fundraising_days()
        setFundraisingDays(parseInt(return_object._hex))
        return_object = await tokenloans_deployed.grace_period_in_months()
        setGracePeriodMonths(parseInt(return_object._hex))
        if (await tokenloans_deployed.time_fundraising_ended() ==0 ){
            setTfundraisingended("N/A");
        } else {
            var time_fundraising_ended = new Date( await tokenloans_deployed.time_fundraising_ended() *1000);
            setTfundraisingended(time_fundraising_ended.toLocaleString());
        }
    }

    async function getInfo() {
        
        //e.preventDefault()
        
        // provider - Default Provider
        setClearBorrower(!clearBorrower)
        setClearDeploy(!clearDeploy)
        setClearInvestor(!clearInvestor)
        if (contract_address == "" && signer_private_key == ""){
            clearInfo();
            setNeedAddress(true);
            setNeedPrivateKey(true);
        } else if(contract_address==""){
            clearInfo();
            setNeedAddress(true);
            setNeedPrivateKey(false);
        } else if(signer_private_key==""){
            clearInfo();
            setNeedPrivateKey(true)
            setNeedAddress(false)
        } else {
            setNeedAddress(false);
            setNeedPrivateKey(false);
            queryContract();
        }
    }

    return (
        <div className = "card rounded-5" style={{padding : "2em", backgroundColor:'#000', borderColor : "white", marginBottom:"3em" }}>
            <h3 style={{marginBottom:"1em"}}>Contract Info</h3>
            <button className="btn button mb-4" style={{width : "10em"}} onClick={() => getInfo()}>Get Info</button>
            <table>
                <tr>
                    <td style = {{width:"40%"}}>
                        <p>Owner's address: </p>
                    </td>
                    <td>
                        <p>{owners_address}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Initial exchange rate per 1000 (ETB):</p>
                    </td> 
                    <td>
                        <p>{discountedpricefor1000TKL}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Number of monthly payments: </p>
                    </td> 
                    <td>
                        <p>{maturityinmonths}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Fundraising days: </p>
                    </td> 
                    <td>
                        <p>{fundraising_days}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Grace period (months):</p>
                    </td> 
                    <td>
                        <p>{grace_period_months}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Fundraising goal (ETH): </p>
                    </td>
                    <td>
                        <p>{fundraisinggoal}</p>
                    </td>
                </tr>
                {/* <tr>
                    <td>
                        <p>Fundraising ended? </p>
                    </td>
                    <td>
                        <p>{fundraisingended? "Yes":"No"}</p>
                    </td>
                </tr> */}
                <tr>
                    <td>
                        <p>Contract funds (ETH): </p>
                    </td>
                    <td>
                        <p>{contractfunds}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Outstanding bonds: </p>
                    </td>
                    <td>
                        <p>{tokenssold}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Outstanding bonds minus contract funds: </p>
                    </td>
                    <td>
                        <p>{outstandingtokensminuscontractfunds}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Percentage paid to investors: </p>
                    </td>
                    <td>
                        <p>{percentagepaidtoinvestors}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Time contract was deployed: </p>
                    </td>
                    <td>
                        <p>{tdeploy}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Time fundraising ended:</p>
                    </td>
                    <td>
                        <p>{tfundraisingended}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Time payment ended: </p>
                    </td>
                    <td>
                        <p>{tpayment}</p>
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Contract ended successfully? </p>
                    </td>
                    <td>
                        <p>{contractendedsuccessfully? "Yes":"No"}</p>
                    </td>
                </tr>
            </table>
        </div>
    )
}



export default ContractInfo;

