/* eslint-disable unused-imports/no-unused-imports-ts */
'use client'

import { useState } from 'react'

import { EAS, SchemaEncoder } from '@ethereum-attestation-service/eas-sdk'
import { ethers } from 'ethers'
import { motion } from 'framer-motion'
import Balancer from 'react-wrap-balancer'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

import { FADE_DOWN_ANIMATION_VARIANTS } from '@/config/design'

import WalletConnectCustom from '../../components/blockchain/wallet-connect-custom'
import { EASContractAddress } from '../utils/utils'

// import { CUSTOM_SCHEMAS, EASContractAddress, baseURL, getAddressForENS } from '../utils/utils'

declare global {
  interface Window {
    ethereum?: any
  }
}

const Title = styled.div`
  color: #163a54;
  font-size: 22px;
  font-family: Montserrat, sans-serif;
`

const Container = styled.div`
  @media (max-width: 700px) {
    width: 100%;
  }
`

const GradientBar = styled.div`
  position: absolute;
  width: 100%;
  height: 200px;
  left: 0;
  top: 79px;
  z-index: -1;
  background: linear-gradient(
    180deg,
    rgba(194, 240, 255, 0.25) 0%,
    rgba(184, 251, 247, 0.25) 19.15%,
    rgba(237, 203, 192, 0.165) 38.91%,
    rgba(135, 169, 239, 0.25) 51.27%,
    rgba(201, 179, 244, 0.25) 66.09%
  );
  filter: blur(50px);
`

const MetButton = styled.div`
  border-radius: 10px;
  border: 1px solid #cfb9ff;
  background: #333342;
  width: 100%;
  padding: 20px 10px;
  box-sizing: border-box;
  color: #fff;
  font-size: 18px;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  cursor: pointer;
`

const SubText = styled.div`
  display: block;
  cursor: pointer;
  text-decoration: underline;
  color: #ababab;
  margin-top: 20px;
`

const InputContainer = styled.div`
  position: relative;
  height: 90px;
`

const EnsLogo = styled.img`
  position: absolute;
  left: 14px;
  top: 28px;
  width: 30px;
`

const InputBlock = styled.input`
  position: absolute;
  top: 0;
  left: 0;
  border-radius: 10px;
  border: 1px solid rgba(19, 30, 38, 0.33);
  background: rgba(255, 255, 255, 0.5);
  color: #131e26;
  font-size: 18px;
  font-family: Chalkboard, sans-serif;
  padding: 20px 10px;
  text-align: center;
  margin-top: 12px;
  box-sizing: border-box;
  width: 100%;
`

const WhiteBox = styled.div`
  box-shadow: 0 4px 33px rgba(168, 198, 207, 0.15);
  background-color: #fff;
  padding: 36px;
  max-width: 590px;
  border-radius: 10px;
  margin: 40px auto 0;
  text-align: center;
  box-sizing: border-box;

  @media (max-width: 700px) {
    width: 100%;
  }
`
const eas = new EAS(EASContractAddress)

export default function Home() {
  const account = useAccount()
  const status = account.status
  const [copied, setCopied] = useState(false)
  const [address, setAddress] = useState('')
  const [ensResolvedAddress, setEnsResolvedAddress] = useState('Dakh.eth')
  const [attesting, setAttesting] = useState(false)

  return (
    <>
      <div className="relative flex flex-1">
        <div className="flex-center flex h-full flex-1 flex-col items-center justify-center text-center">
          <motion.div
            className="max-w-3xl px-5 xl:px-0"
            initial="hidden"
            whileInView="show"
            animate="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: {
                transition: {
                  staggerChildren: 0.15,
                },
              },
            }}>
            <motion.h1
              className="text-gradient-sand text-center text-6xl font-bold tracking-[-0.02em] drop-shadow-sm md:text-8xl md:leading-[6rem]"
              variants={FADE_DOWN_ANIMATION_VARIANTS}>
              <Balancer>I attest that I have met </Balancer>
            </motion.h1>
            <motion.div
              className="mx-auto mt-6 flex flex-wrap items-center justify-center gap-y-3 space-x-4"
              variants={FADE_DOWN_ANIMATION_VARIANTS}></motion.div>
            <motion.p className="mt-8 text-center text-sm" variants={FADE_DOWN_ANIMATION_VARIANTS}>
              <Container>
                <GradientBar />
                <WhiteBox>
                  <Title>
                    I <b>attest</b> that I met
                  </Title>

                  <InputContainer>
                    <InputBlock
                      autoCorrect={'off'}
                      autoComplete={'off'}
                      autoCapitalize={'off'}
                      placeholder={'Address/ENS'}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                    {ensResolvedAddress && <EnsLogo src={'/ens-logo.png'} />}
                  </InputContainer>
                  {status !== 'connected' ? (
                    <WalletConnectCustom />
                  ) : (
                    <MetButton
                      onClick={async () => {
                        console.log('hello')
                        if (status !== 'connected') {
                          console.log('connected')
                        } else {
                          setAttesting(true)
                          try {
                            const provider = new ethers.providers.Web3Provider(window.ethereum as unknown as ethers.providers.ExternalProvider)
                            const signer = provider.getSigner()

                            eas.connect(signer)

                            const schemaEncoder = new SchemaEncoder('bool metIRL')
                            const encoded = schemaEncoder.encodeData([{ name: 'metIRL', type: 'bool', value: true }])

                            const recipient = address
                            console.log(recipient)
                            const offchain = await eas.getOffchain()

                            const time = Math.floor(Date.now() / 1000)
                            const offchainAttestation = await offchain.signOffchainAttestation(
                              {
                                recipient,
                                // Unix timestamp of when attestation expires. (0 for no expiration)
                                expirationTime: 0,
                                // Unix timestamp of current time
                                time,
                                revocable: true,
                                version: 1,
                                nonce: 0,
                                schema: '0xc59265615401143689cbfe73046a922c975c99d97e4c248070435b1104b2dea7',
                                refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
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
                            }
                            const requestOptions = {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(requestBody),
                            }

                            await fetch('/api/attest', requestOptions)
                              .then((response) => response.json())
                              .then((data) => console.log(data))
                            setAddress('')
                            setAttesting(false)
                          } catch (e) {}
                          setAddress('')
                          setAttesting(false)
                        }
                      }}>
                      {attesting ? 'Attesting...' : status === 'connected' ? 'Make Offchain attestation' : 'Connect wallet'}
                    </MetButton>
                  )}

                  {status === 'connected' && (
                    <>
                      <SubText>
                        {' '}
                        <a href="/qr">Show my QR code</a>
                      </SubText>
                      <SubText>
                        {' '}
                        <a href="/connections">Connections</a>
                      </SubText>
                    </>
                  )}
                </WhiteBox>
              </Container>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
