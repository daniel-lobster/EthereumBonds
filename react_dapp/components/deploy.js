import { useState, useEffect} from 'react'
const { ethers } = require("ethers");
const contract = require("../TokenLoans.json");


function Deploy(
    {setContractAddress, 
    signer_private_key, 
    refresh, 
    setRefresh, 
    clearDeploy,
    clearBorrower,
    setClearBorrower,
    clearInvestor,
    setClearInvestor,
    setNeedPrivateKey,
    setNeedAddress
}) {
    
    const [fundraising_goal, setFundraisingGoal] = useState("")
    const [initial_exchange_rate, setInitialExchangeRate] = useState("")
    const [months_to_maturity, setMonthsToMaturity] = useState("")
    const [fundraising_days, setFundraisingDays] = useState("")
    const [grace_period_months, setGracePeriodMonths] = useState("")
    const [warning, setWarning] = useState(false)
    const [needFundraisingGoal, setNeedFundraisingGoal] = useState(false)
    const [needExchangeRate, setNeedExchangeRate] = useState(false)
    const [needMonthlyPayments, setNeedMonthlyPayments] = useState(false)
    const [needFundraisingDays, setNeedFundraisingDays] = useState(false)
    const [needGracePeriod, setNeedGracePeriod] = useState(false)

    useEffect(()=>{
        clearDeployInfo();
        clearWarnings()
    },[clearDeploy])

    function clearWarnings(){
        setNeedFundraisingGoal(false)
        setNeedExchangeRate(false)
        setNeedMonthlyPayments(false)
        setNeedFundraisingDays(false)
        setNeedGracePeriod(false)
        setWarning(false)
        
    }

    function checkCompleteness(){
        clearWarnings()
        setContractAddress("")
        setNeedAddress(false)
        setNeedPrivateKey(false)
        if(signer_private_key==""){
            setNeedPrivateKey(true)
        }
        if(fundraising_goal==""){
            setNeedFundraisingGoal(true)
            setWarning(true)
        }
        if (initial_exchange_rate==""){
            setNeedExchangeRate(true)
            setWarning(true)
        }
        if (months_to_maturity==""){
            setNeedMonthlyPayments(true)
            setWarning(true)
        }
        if (fundraising_days==""){
            setNeedFundraisingDays(true)
            setWarning(true)
        }
        if (grace_period_months==""){
            setNeedGracePeriod(true)
            setWarning(true)
        }
    }

    function deploy(e) {
        checkCompleteness()
        setClearBorrower(!clearBorrower)
        setClearInvestor(!clearInvestor)
        asyncDeploy(e)
    }

    async function asyncDeploy(e){
        e.preventDefault()
        const provider = new ethers.providers.JsonRpcProvider("http://localhost:7545");
        const signer = new ethers.Wallet(signer_private_key, provider);
        const tokenloans = await new ethers.ContractFactory(contract.abi,contract.bytecode,signer);
        // Start deployment, returning a promise that resolves to a contract object
        const wei_in_ether = ethers.BigNumber.from(10).pow(18)
        const fundraising_goal_bignumber = ethers.BigNumber.from(fundraising_goal).mul(wei_in_ether)
        const tokenloans_deployed = await tokenloans.deploy(fundraising_goal_bignumber,initial_exchange_rate,months_to_maturity,fundraising_days,grace_period_months);
        setContractAddress(tokenloans_deployed.address)
        setRefresh(!refresh)
        setFundraisingGoal("")
        setInitialExchangeRate("")
        setMonthsToMaturity("")
        setFundraisingDays("")
        setGracePeriodMonths("")
        clearWarnings()
    }

    function clearDeployInfo() {
        setFundraisingGoal("")
        setInitialExchangeRate("")
        setMonthsToMaturity("")
        setFundraisingDays("")
        setGracePeriodMonths("")
    }

    return (
        <fieldset>
            <h3>Deploy</h3>
            <table>
                <tr>
                    <td style = {{width:"55%"}}>
                        <p>Fundraising goal (ETH):</p>
                    </td>
                    <td style = {{width:"35%"}}>
                        <input type="number" value={fundraising_goal} onChange={(e) => setFundraisingGoal((e.target.value))}/>
                    </td>
                    <td style = {{width:"5%"}}>
                        {needFundraisingGoal ? <div style={{height:'1em',fontSize:"1.5em"}} className="warning">*</div>:<div style={{height:'1em'}}></div>}
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Initial exchange rate per 1000 (ETB):</p>
                    </td>
                    <td>
                        <input type="number" value={initial_exchange_rate} onChange={(e) => setInitialExchangeRate(e.target.value)}/>
                    </td>
                    <td>{needExchangeRate ? <div style={{height:'1em',fontSize:"1.5em"}} className="warning">*</div>:<div style={{height:'1em'}}></div>}</td>
                </tr>
                <tr>
                    <td>
                        <p>Number of monthly payments:</p>
                    </td>
                    <td>
                        <input type="number" value={months_to_maturity} onChange={(e) => setMonthsToMaturity(e.target.value)}/>
                    </td>
                    <td>
                        {needMonthlyPayments ? <div style={{height:'1em',fontSize:"1.5em"}} className="warning">*</div>:<div style={{height:'1em'}}></div>}
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Fundraising days:</p>
                    </td>
                    <td>
                        <input type="number" value={fundraising_days} onChange={(e) => setFundraisingDays(e.target.value)}/>
                    </td>
                    <td>
                        {needFundraisingDays ? <div style={{height:'1em',fontSize:"1.5em"}} className="warning">*</div>:<div style={{height:'1em'}}></div>}
                    </td>
                </tr>
                <tr>
                    <td>
                        <p>Grace period (months):</p>
                    </td>
                    <td>
                        <input type="number" value={grace_period_months} onChange={(e) => setGracePeriodMonths(e.target.value)}/>
                    </td>
                    <td>
                        {needGracePeriod ? <div style={{height:'1em',fontSize:"1.5em"}} className="warning">*</div>:<div style={{height:'1em'}}></div>}
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        {warning ? <div style={{height:'1em'}} className="warning">*Required field</div>:<div style={{height:'1em'}}></div>}
                    </td>
                    <td></td>
                </tr>
            </table>
            <button className="btn button" style={{marginBottom:"0"}} onClick={(e) => deploy(e)}>Deploy</button> 
        </fieldset>
    )
}

export default Deploy;
