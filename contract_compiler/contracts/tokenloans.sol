pragma solidity ^0.5.0;

import "./ERC20.sol";
import "./ERC20Detailed.sol";
import "./ERC20Mintable.sol";


contract TokenLoans is ERC20, ERC20Detailed, ERC20Mintable {
    uint public fundraising_goal_in_wei;
    uint public discounted_price_for_1000TKL;
    uint public maturity_in_months;
    bool public fundraising_ended; // default is false
    bool public contract_ended_successfully;
    mapping(address => uint256) private _investorTokens;
    uint private totalTokens;
    uint private numberOfInvestors;
    address[] private _investorAddresses;
    address public owner;
    uint public time_fundraising_ended;
    uint public time_payment_ended;
    uint public percentage_paid_to_investors;
    uint public total_paid_to_investors;
    uint public number_of_fundraising_days;
    uint public time_contract_deployment;
    uint public grace_period_in_months;

    constructor(
        uint  _fundraising_goal_in_wei,
        uint _discounted_price_for_1000TKL,
        uint _maturity_in_months,
        uint _number_of_fundraising_days,
        uint _grace_period_in_months
    )
        ERC20Detailed("TokenLoans", "TKL", 18)
        public 
    {
        fundraising_goal_in_wei = _fundraising_goal_in_wei;
        discounted_price_for_1000TKL = _discounted_price_for_1000TKL;
        maturity_in_months = _maturity_in_months;
        owner = msg.sender;
        number_of_fundraising_days = _number_of_fundraising_days;
        time_contract_deployment=now;
        grace_period_in_months = _grace_period_in_months;
    }
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        // Underscore is a special character only used inside
        // a function modifier and it tells Solidity to
        // execute the rest of the code.
        _;
    }

    function totalContractFundsinWei() public view returns (uint256) {
        return address(this).balance;
    }

    function balanceOfSender() public view returns (uint){
        return balanceOf(msg.sender);
    }

    function buyTKL_with_wei() public payable{
        require (fundraising_ended==false, "fundraising has ended, sorry!");
        uint balance = address(this).balance;
        require (balance<=fundraising_goal_in_wei, "either the borrower has reached the goal or your order is too large");
        uint newvalue = msg.value*1000/discounted_price_for_1000TKL;
        if (_investorTokens[msg.sender]==0){
            _investorAddresses.push(msg.sender);
            numberOfInvestors = numberOfInvestors+1;
        }
        _mint(msg.sender,newvalue);
        _investorTokens[msg.sender] = _investorTokens[msg.sender].add(newvalue);
        totalTokens = totalTokens + newvalue;
        if(balance == fundraising_goal_in_wei){
            fundraising_ended = true;
            time_fundraising_ended = now;
        }
    }

    function sendPaymentToInvestors (uint amount) public onlyOwner payable{
        require (fundraising_ended==true, "fundraising hasn't ended, sorry!");
        for (uint i = 0; i < numberOfInvestors; i++) {
            uint investorPayment = amount * _investorTokens[_investorAddresses[i]]/totalTokens;
            address wallet_address = _investorAddresses[i];
            address payable wallet_address_payable = address(uint160(wallet_address));
            wallet_address_payable.transfer(investorPayment);
            _burn(_investorAddresses[i], investorPayment);
        }
        uint provisional_total_supply = totalSupply();
        if(provisional_total_supply<100){
            time_payment_ended= now;
            uint payment_period_seconds = time_payment_ended-time_fundraising_ended;
            uint stated_payment_period = (maturity_in_months+grace_period_in_months)*30 days;
            if(payment_period_seconds<=stated_payment_period){
                contract_ended_successfully= true;
            }
        }
        total_paid_to_investors=total_paid_to_investors+amount;
        percentage_paid_to_investors= total_paid_to_investors*100/totalTokens;
    }
    
    function makeMonthlyPayment() public onlyOwner payable{
        uint monthlyPayment = totalTokens/maturity_in_months;
        sendPaymentToInvestors (monthlyPayment);
    }
    function outanding_tokens_minus_contract_funds() public view returns (uint256) {
        uint amount = totalSupply() - address(this).balance ;
        return amount;
    }

    function withdraw_funds(uint amount) public onlyOwner payable{
        require (fundraising_ended==true, "fundraising hasn't ended, sorry!");
        msg.sender.transfer(amount);
    }
    function deposit () public onlyOwner payable{
        require (fundraising_ended==true, "fundraising hasn't ended, sorry!");
        msg.value;
    }

    function investor_refund_principal() public payable {
        uint number_of_fundraising_seconds = number_of_fundraising_days * 1 days;
        uint seconds_since_deployment = now - time_contract_deployment;
        require (seconds_since_deployment>number_of_fundraising_seconds);
        require (fundraising_ended == false);
        uint amount = address(this).balance;
         for (uint i = 0; i < numberOfInvestors; i++) {
            uint investorPayment = amount * _investorTokens[_investorAddresses[i]]/totalTokens;
            address wallet_address = _investorAddresses[i];
            address payable wallet_address_payable = address(uint160(wallet_address));
            wallet_address_payable.transfer(investorPayment);
            _burn(_investorAddresses[i], investorPayment);
        }       
    }
        function owner_refund_principal() public onlyOwner payable {
        require (fundraising_ended == false);
        uint amount = address(this).balance;
         for (uint i = 0; i < numberOfInvestors; i++) {
            uint investorPayment = amount * _investorTokens[_investorAddresses[i]]/totalTokens;
            address wallet_address = _investorAddresses[i];
            address payable wallet_address_payable = address(uint160(wallet_address));
            wallet_address_payable.transfer(investorPayment);
            _burn(_investorAddresses[i], investorPayment);
        }       
    }

}