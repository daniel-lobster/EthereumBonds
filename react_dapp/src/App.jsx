import { useState } from 'react'
import ContractInfo from './components/contract_info';
import Investor from './components/investor';
import Borrower from './components/borrower';




function App() {
    const [contract_address, setContractAddress] = useState("")
    const [signer_private_key, setSignerPrivateKey] = useState("")
    const [refresh, setRefresh] = useState(false)
    const [clearBorrower, setClearBorrower] = useState(false)
    const [clearDeploy, setClearDeploy] = useState(false)
    const [clearInvestor, setClearInvestor] = useState(false)
    const [clearContractInfo, setClearContractInfo] = useState(false)
    const [needAddress, setNeedAddress] = useState(false)
    const [needPrivateKey, setNeedPrivateKey] = useState(false)


    function clearInfo(){
        setContractAddress("")
        setSignerPrivateKey("")
        setClearBorrower(!clearBorrower)
        setClearDeploy(!clearDeploy)
        setClearInvestor(!clearInvestor)
        setClearContractInfo(!clearContractInfo)
        setNeedAddress(false)
        setNeedPrivateKey(false)
    }

    return (
        <fieldset  className = "container" style ={{backgroundColor:'#000'}}>
            <div className="mb-5 mt-5 d-flex align-items-center">
                <img src="./lobster.png" style ={{borderRadius:"50%", width:"8em", marginRight:"2em"}}alt="lobster"/>
                <h1>EthereumBonds: Issue Bonds in the Ethereum Blockchain</h1>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', marginBottom:'2em', alignContent:"center"}}>
                <table>
                    <tr>
                        <td style={{marginRight:'1em', alignItems:'start', width:"14em"}}><h4>Contract Address:</h4></td>
                        <td>
                            <input type="text" value={contract_address} onChange={(e) => setContractAddress(e.target.value)} style={{width:'40em', fontSize:'1em'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                        {needAddress ? <div style={{height:'2em'}} className="warning">Please include the contract address</div>:<div style={{height:'2em'}}></div>} 
                        </td>
                    </tr>
                    <tr>
                        <td style={{marginRight:'1em'}}><h4>Signer Private Key:</h4></td>
                        <td>
                            <input type="text" value={signer_private_key} onChange={(e) => setSignerPrivateKey(e.target.value)} style={{width:'40em', fontSize:'1em'}}/>
                        </td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>
                        {needPrivateKey ? <div style={{height:'1em'}} className="warning">Please include a private key</div>:<div style={{height:'1em'}}></div>} 
                        </td>
                    </tr>
                </table>
                <div style={{margin:"auto 0"}}>
                    <button type="button" className="btn button" style={{width:"10em", height:"4em"}} onClick={(e) => clearInfo(e)}>Clear</button>
                </div>
                
            </div>
            <div style={{display:'flex'}}>
                <div style  ={{flex:45, marginRight:"1em"}}>
                    <Borrower 
                        contract_address={contract_address} 
                        setContractAddress={setContractAddress}
                        signer_private_key={signer_private_key} 
                        refresh = {refresh} 
                        setRefresh = {setRefresh} 
                        clearBorrower={clearBorrower}
                        setClearBorrower={setClearBorrower}
                        clearDeploy={clearDeploy}
                        setClearDeploy={setClearDeploy}
                        clearInvestor = {clearInvestor}
                        setClearInvestor = {setClearInvestor}
                        setNeedPrivateKey={setNeedPrivateKey}
                        setNeedAddress={setNeedAddress}
                    />
                    
                </div>
                <div style  ={{flex:55, marginLeft:"1em"}}>
                    <Investor 
                        contract_address={contract_address} 
                        signer_private_key={signer_private_key} 
                        refresh = {refresh} 
                        setRefresh = {setRefresh} 
                        clearInvestor={clearInvestor}
                        setNeedAddress={setNeedAddress} 
                        setNeedPrivateKey={setNeedPrivateKey}
                        clearBorrower={clearBorrower}
                        setClearBorrower={setClearBorrower}
                        clearDeploy={clearDeploy}
                        setClearDeploy={setClearDeploy}
                    />
                    <ContractInfo
                        contract_address={contract_address} 
                        signer_private_key={signer_private_key} 
                        refresh = {refresh} 
                        setRefresh = {setRefresh} 
                        clearContractInfo ={clearContractInfo} 
                        setNeedAddress={setNeedAddress} 
                        setNeedPrivateKey={setNeedPrivateKey}
                        clearBorrower={clearBorrower}
                        setClearBorrower={setClearBorrower}
                        clearDeploy={clearDeploy}
                        setClearDeploy={setClearDeploy}
                        clearInvestor = {clearInvestor}
                        setClearInvestor = {setClearInvestor} 
                    />    
                </div>       
            </div>
                <br/>
                <hr style={{color:'white', height:'2px', borderWidth:'0', backgroundColor:'white', opacity:'1'}}/>
                <p> Copyright © 2023  Daniel Pulido-Mendez</p>

                <p>This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, version 3 of the License.</p>

                <p>This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.</p>

                <p>For GNU General Public License see https://www.gnu.org/licenses/.</p>
                
        </fieldset>

    )
}

export default App;
