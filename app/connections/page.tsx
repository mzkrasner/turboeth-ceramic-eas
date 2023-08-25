/* eslint-disable unused-imports/no-unused-imports-ts */
'use client'
import React, { useEffect, useState } from 'react'

import { EAS } from '@ethereum-attestation-service/eas-sdk'
import { motion } from 'framer-motion'
import Balancer from 'react-wrap-balancer'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

import { FADE_DOWN_ANIMATION_VARIANTS } from '@/config/design'

import { AttestationItem } from '../../components/app/AttestationItem'
import GradientBar from '../../components/app/GradientBar'
import { ResolvedAttestation } from '../utils/types'
import { EASContractAddress } from '../utils/utils'

const Container = styled.div`
  @media (max-width: 700px) {
    width: 100%;
  }
`

const AttestationHolder = styled.div``

const NewConnection = styled.div`
  color: #333342;
  text-align: center;
  font-size: 25px;
  font-family: Montserrat, sans-serif;
  font-style: italic;
  font-weight: 700;
  margin-top: 20px;
`

const WhiteBox = styled.div`
  box-shadow: 0 4px 33px rgba(168, 198, 207, 0.15);
  background-color: #fff;
  padding: 20px;
  width: 590px;
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
  const address = useAccount()
  const [attestations, setAttestations] = useState<ResolvedAttestation[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    console.log(address.address)
    async function getAtts() {
      const requestBody = { account: address.address }
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      }
      const tmpAttestations = await fetch('/api/all', requestOptions)
        .then((response) => response.json())
        .then((data) => data)
      console.log(tmpAttestations.data)
      setAttestations([])
      setLoading(true)
      if (!address.address || !tmpAttestations.data.attestationIndex) return
      // const tmpAttestations = await getAttestationsForAddress(address);
      console.log(tmpAttestations.data.attestationIndex.edges)
      const allRecords = tmpAttestations.data.attestationIndex.edges
      const addresses = new Set<string>()

      allRecords.forEach((att: any) => {
        const obj = att.node
        addresses.add(obj.attester)
        addresses.add(obj.recipient)
      })

      // const ensNames = await getENSNames(Array.from(addresses));

      console.log(addresses)
      // const ensNames = await getENSNames(Array.from(addresses))
      const stringified = JSON.stringify(allRecords)

      const reqOpts = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: stringified,
      }

      console.log(allRecords)

      let confirmations: any
      if (allRecords.length) {
        confirmations = await fetch('/api/confirmations', reqOpts)
          .then((response) => response.json())
          .then((data) => data)

        console.log(confirmations)
      }

      const records: any[] = []
      allRecords.forEach((att: any) => {
        const item = att.node
        // console.log(item)
        // const amIAttester = item.attester.toLowerCase() === address.toLowerCase();

        if (att.node.confirm.edges.length) {
          item.confirmation = true
        }
        item.uid = att.node.uid
        records.push(item)
      })

      setAttestations([...attestations, ...records])
      setLoading(false)
    }
    getAtts()
    // console.log(attestations.length)
  }, [address.address])

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
                <NewConnection>Who you met IRL.</NewConnection>
                <AttestationHolder>
                  <WhiteBox>
                    {loading && <div>Loading...</div>}
                    {attestations.length > 0 || loading ? (
                      attestations.map((attestation, i) => <AttestationItem key={i} data={attestation} />)
                    ) : (
                      <div>No one here yet</div>
                    )}
                  </WhiteBox>
                </AttestationHolder>
              </Container>
            </motion.p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
