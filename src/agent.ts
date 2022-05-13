import {
  Finding,
  FindingType,
  FindingSeverity,
  HandleTransaction,
  TransactionEvent,
} from 'forta-agent'

export const nethermind_deployer="0x88dC3a2284FA62e0027d6D6B1fCfDd2141a143b8"
export const forta_bot_registry="0x61447385B019187daa48e91c55c02AF1F1f3F863"
export const forta_create_agent="0xA8A26969f7Be888D020B595340c490c02ec445dD"

export const createAgent="function createAgent(uint256 agentId, address owner, string metadata, uint256[] chainIds)"

const handleTransaction : HandleTransaction = async (tx : TransactionEvent) => {
  const findings : Finding[] = []

  if((tx.from).toLowerCase()==(nethermind_deployer).toLowerCase() && (tx.to)?.toLowerCase()==(forta_bot_registry).toLowerCase()){

    const forta_event_log =await tx.filterFunction(
          createAgent, forta_bot_registry);


    for(var object_ of forta_event_log){
      const event_name=object_.name;

      if (event_name!="createAgent"){
        continue
      }

      findings.push(
        Finding.fromObject({
          name:"nethermind deployer detected",
          description:"(${nether_deployer}) deployed a forta agent",
          alertId: 'FORTA-1',
          type: FindingType.Info,
          severity: FindingSeverity.Info,
          metadata: {
                        deployer: nethermind_deployer,
                        deployed_to: forta_bot_registry,
                        event:event_name
                      }
        })
      )
    }
  }

  return findings
}

export default {
  handleTransaction
}
