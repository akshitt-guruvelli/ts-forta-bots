import {
  Finding,
  FindingType,
  FindingSeverity,
  HandleTransaction,
  TransactionEvent,
  Transaction
} from 'forta-agent'

export const nethermind_deployer="0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8"
export const forta_bot_registry="0x61447385B019187daa48e91c55c02AF1F1f3F863"
export const forta_create_agent="0xA8A26969f7Be888D020B595340c490c02ec445dD"

const createAgent_abi="{'inputs':[{'internalType':'uint256','name':'agentId','type':'uint256'},{'internalType':'address','name':'owner','type':'address'},{'internalType':'string','name':'metadata','type':'string'},{'internalType':'uint256[]','name':'chainIds','type':'uint256[]'}],'name':'createAgent','outputs':[],'stateMutability':'nonpayable','type':'function'}"

function provideHandleTransaction(nether_deployer : typeof nethermind_deployer) : HandleTransaction{
  return async function handleTransaction(tx : TransactionEvent){
    const findings: Finding[] = []

    const transaction_deployer=tx.from
    const transaction_to=tx.to

    if(transaction_deployer===nether_deployer && transaction_to===forta_bot_registry){

      const forta_event_log = tx.filterFunction(
            createAgent_abi, forta_create_agent);

      for(var object_ of forta_event_log){
        const event_name=object_.name;

        if (event_name!=="createAgent"){
          continue
        }

        findings.push(
          Finding.fromObject({
            name:"nethermind deployer detected",
            description:"(${nether_deployer}) deployed a forta agent",
            alertId: 'FORTA-7',
            type: FindingType.Info,
            severity: FindingSeverity.Info,
            metadata: {
                          deployer: nether_deployer,
                          deployed_to: forta_bot_registry,
                          event:event_name
                        }
          })
        )
      }
    }
    return findings
  }
}

export default{
  provideHandleTransaction,
  handleTransaction : provideHandleTransaction(nethermind_deployer)
}
