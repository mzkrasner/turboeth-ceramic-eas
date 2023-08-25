/* eslint-disable unused-imports/no-unused-imports-ts */
'use client'
import React, { useEffect, useState } from 'react'

import { EAS } from '@ethereum-attestation-service/eas-sdk'
import { motion } from 'framer-motion'
import { Link } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import Balancer from 'react-wrap-balancer'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

import { FADE_DOWN_ANIMATION_VARIANTS } from '@/config/design'

import GradientBar from '../../components/app/GradientBar'
import { EASContractAddress, getENSName } from '../utils/utils'

const Container = styled.div`
  @media (max-width: 700px) {
    width: 100%;
  }
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
    margin: 10px auto;
  }
`

const SubText = styled(Link)`
  display: block;
  cursor: pointer;
  text-decoration: underline;
  color: #ababab;
  margin-top: 20px;

  @media (min-width: 700px) {
    display: none;
  }
`

const FinalAddress = styled.div`
  color: #333342;
  text-align: center;
  font-size: 18px;
  font-family: Montserrat, sans-serif;
  font-weight: 700;
  word-break: break-all;
`

const SmallWhiteBox = styled(WhiteBox)`
  max-width: 400px;
  position: relative;
  padding-bottom: 40px;
`

const eas = new EAS(EASContractAddress)

export default function Home() {
  let account = useAccount()
  const address = account.address
  const [ens, setEns] = useState('')

  useEffect(() => {
    async function checkENS() {
      if (!address) return
      const name = await getENSName(address)
      if (name) {
        setEns(name)
      } else {
        setEns('')
      }
    }

    checkENS()
  }, [address])

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
                <SmallWhiteBox>
                  <FinalAddress>{ens ? ens : address}</FinalAddress>

                  {address && <QRCodeSVG style={{}} value={`https://metirl.org/?address=${ens ? ens : address}`} includeMargin={true} size={300} />}

                  <SubText to={'/'}>Back home</SubText>
                </SmallWhiteBox>
              </Container>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
