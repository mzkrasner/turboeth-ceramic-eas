import { useState } from 'react'

import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk'
import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { MdOutlineVerified, MdVerified } from 'react-icons/md'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

import { Identicon } from './Identicon'
import { theme } from '../../app/utils/theme'
import { ResolvedAttestation } from '../../app/utils/types'
import { CUSTOM_SCHEMAS, EASContractAddress, baseURL, timeFormatString } from '../../app/utils/utils'

const Container = styled.div`
  border-radius: 25px;
  border: 1px solid rgba(168, 198, 207, 0.4);
  background: #fff;
  padding: 14px;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  margin-bottom: 10px;
  align-items: center;
  gap: 16px;
  cursor: pointer;

  @media (max-width: 700px) {
    display: block;
    text-align: center;
  }
`

const VerifyIconContainer = styled.div`
  @media (max-width: 700px) {
    margin-top: 16px;
  }
`

const IconHolder = styled.div`
  @media (max-width: 700px) {
    display: flex;
    justify-content: center;
    margin-bottom: 10px;
  }
`
const NameHolder = styled.div`
  color: #000;
  text-align: center;
  font-size: 14px;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  word-break: break-all;

  @media (max-width: 700px) {
    margin-bottom: 10px;
  }
`
const Time = styled.div`
  color: #adadad;
  text-align: center;
  font-size: 14px;
  font-family: Montserrat, serif;
`
const Check = styled.div``

const ConfirmButton = styled.div`
  display: inline-block;
  border-radius: 10px;
  border: 1px solid #cfb9ff;
  background: #333342;
  padding: 8px;
  box-sizing: border-box;
  color: #fff;
  font-size: 12px;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  cursor: pointer;

  :hover {
    background: #cfb9ff;
    color: #333342;
  }

  @media (max-width: 700px) {
    margin-top: 10px;
    width: 100%;
    padding: 14px 8px;
  }
`

type Props = {
  data: ResolvedAttestation
}

const eas = new EAS(EASContractAddress)

export function AttestationItem({ data }: Props) {
  const accounts = useAccount()
  const address = accounts.address
  const [confirming, setConfirming] = useState(false)

  if (!address) return null

  const isAttester = data.attester.toLowerCase() === address.toLowerCase()
  let isConfirmed = !!data.confirmation
  const isConfirmable = !isAttester && !isConfirmed

  // eslint-disable-next-line react-hooks/rules-of-hooks

  let Icon = MdVerified

  if (!isConfirmed) {
    Icon = MdOutlineVerified
  }

  return (
    <Container
      onClick={() => {
        window.open(`${baseURL}/attestation/view/${data.id}`)
      }}>
      <IconHolder>
        <Identicon address={isAttester ? data.recipient : data.attester} size={60} />
      </IconHolder>
      <NameHolder>
        <p>From:</p> {data.attester} <p>To:</p> {data.recipient}
      </NameHolder>
      <Time>{dayjs.unix(data.time).format(timeFormatString)}</Time>
      <Check>
        {isConfirmable ? (
          <ConfirmButton
            onClick={async (e) => {
              e.stopPropagation()
              setConfirming(true)
              try {
                const provider = new ethers.providers.Web3Provider((window as any).ethereum as unknown as ethers.providers.ExternalProvider)
                const signer = provider.getSigner()
                console.log(signer)
                eas.connect(signer)

                const schemaEncoder = new SchemaEncoder('bool confirm')
                const encoded = schemaEncoder.encodeData([{ name: 'confirm', type: 'bool', value: true }])

                // const recipient = data.attester;
                const offchain = await eas.getOffchain()
                const time = Math.floor(Date.now() / 1000)
                const offchainAttestation = await offchain.signOffchainAttestation(
                  {
                    recipient: ethers.constants.AddressZero,
                    // Unix timestamp of when attestation expires. (0 for no expiration)
                    expirationTime: 0,
                    // Unix timestamp of current time
                    time,
                    revocable: true,
                    version: 1,
                    nonce: 0,
                    schema: CUSTOM_SCHEMAS.CONFIRM_SCHEMA,
                    refUID: data.uid,
                    data: encoded,
                  },
                  signer
                )

                // const transaction = await eas.timestamp(offchainAttestation.uid);

                // // Optional: Wait for the transaction to be validated
                // await transaction.wait();
                const userAddress = await signer.getAddress()
                // offchainAttestation.account = addy
                console.log(offchainAttestation)
                const requestBody = {
                  ...offchainAttestation,
                  account: userAddress,
                  stream: data.id,
                }
                const requestOptions = {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(requestBody),
                }
                await fetch('/api/confirmAttest', requestOptions)
                  .then((response) => response.json())
                  .then((data) => console.log(data))

                setConfirming(false)
                window.location.reload()
              } catch (e) {}
            }}>
            {confirming ? 'Confirming...' : 'Confirm we met'}
          </ConfirmButton>
        ) : (
          <VerifyIconContainer>
            <Icon color={data.confirmation ? theme.supporting['green-vivid-400'] : theme.neutrals['cool-grey-100']} size={22} />
          </VerifyIconContainer>
        )}
      </Check>
    </Container>
  )
}
