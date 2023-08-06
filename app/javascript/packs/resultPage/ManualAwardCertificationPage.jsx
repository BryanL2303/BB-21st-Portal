import React, { useEffect, useState, useContext } from 'react'
import Popup from 'reactjs-popup';
import { useParams } from 'react-router-dom'
import { PDFViewer, Document, Text, Page, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import styled from "@react-pdf/styled-components";
import Cookies from 'universal-cookie'
import axios from 'axios'
import {NavigationBar} from '../general/NavigationBar'

/*For officers/primers to generate award certifications
No longer used in new awards system
*/
const ManualAwardCertificationPage = ({award, masteryLevel, instructor}) => {
  const cookies = new Cookies()

  const styles = StyleSheet.create({
    viewer: {
      width: '75vw',
      marginLeft: '12.5vw',
      height: '80vh',
      fontFamily: 'Times-Roman'
    },
    text: {
      color: '#228b22',
    }
  });

  const Header = styled.View`
    margin-top: 15%;
    flex-wrap: nowrap;
    display: flex;
    flex-direction: row;
    align-content: center;
    justify-content: center;
  `;

  const HeaderColumn = styled.View`
    display: flex;
    flex-direction: column;
    font-size: 12px;
  `;

  const HeaderRow = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: center;
  `;

  const AddresseeText = styled.View`
    margin-top: 3%;
    width: 70%;
    height: 13%;
    flex-wrap: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: flex-start;
  `;

  const AddresseeColumn = styled.View`
    display: flex;
    flex-direction: column;
    font-size: 10px;
  `;

  const AddresseeRow = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  `;

  const AddresserColumn = styled.View`
    display: flex;
    flex-direction: column;
    font-size: 10px;
  `;

  const AddresserRow = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
  `;

  const DescriptionBlock = styled.View`
    flex-wrap: nowrap;
    display: flex;
    flex-direction: row;
    align-content: flex-start;
  `;

  const Label = styled.View`
    width: 25%;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    justify-content: center;
    font-size: 10px;
  `;

  const Description = styled.View`
    margin-left: 1%;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    justify-content: center;
    font-size: 10px;
  `;

  const CredentialsBlock = styled.View`
    flex-wrap: nowrap;
    display: flex;
    flex-direction: row;
    align-content: flex-start;
  `;

  const CredentialLabel = styled.View`
    width: 25%;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    font-size: 10px;
  `;

  const Credential = styled.View`
    width: 50%;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    font-size: 10px;
  `;

  return(
        <Page>
          <View style={styles.viewer}>
            <Header>              
              <HeaderColumn>
                  <HeaderRow>
                    <Text style={{fontFamily: 'Times-Bold'}}>THE BOYS' BRIGADE IN SINGAPORE</Text>
                  </HeaderRow>
                  <HeaderRow>
                    <Text style={{fontFamily: 'Times-Bold', fontSize: '10px'}}>AWARDS CERTIFICATION FORM</Text>
                  </HeaderRow>
                  <HeaderRow>
                    <Text>(To accompany Form 32A)</Text>
                  </HeaderRow>
                </HeaderColumn>
            </Header>
            <AddresseeText>                
                <AddresseeColumn>
                  <AddresseeRow>
                    <Text>TO</Text>
                  </AddresseeRow>
                  <AddresseeRow>
                    <Text>CHAIRMAN</Text>
                  </AddresseeRow>
                  <AddresseeRow>
                    <Text>SENIORS PROGRAMME</Text>
                  </AddresseeRow>
                  <AddresseeRow>
                    <Text style={{fontSize: '9px'}}>The Boys' Brigade in Singapore</Text>
                  </AddresseeRow>
                  <AddresseeRow>
                    <Text style={{fontSize: '9px'}}>BB Campus</Text>
                  </AddresseeRow>
                  <AddresseeRow>
                    <Text style={{fontSize: '9px'}}>1200 Sembawang Rd</Text>
                  </AddresseeRow>
                  <AddresseeRow>
                    <Text style={{fontSize: '9px'}}>Singapore 758526</Text>
                  </AddresseeRow>
                </AddresseeColumn>
                <AddresserColumn>
                  <AddresserRow>
                    <Text>FROM</Text>
                  </AddresserRow>
                  <AddresserRow>
                    <Text>THE CAPTAIN</Text>
                  </AddresserRow>
                  <AddresserRow>
                    <Text style={{fontSize: '9px'}}>21st Singapore Company</Text>
                  </AddresserRow>
                </AddresserColumn>
              </AddresseeText>

          <DescriptionBlock style={{marginLeft: '12%'}}>
            <Label style={{fontFamily: 'Times-Bold'}}>
              <Text style={{height: '1.4vh'}}>NAME OF AWARD</Text>
              <Text style={{height: '1.4vh'}}></Text>
              <Text style={{height: '1.4vh'}}>STAGE</Text>
            </Label>
            <Description>
              <Text style={{height: '1.4vh'}}>:   {award.badge_name}</Text>
              <Text style={{height: '1.4vh'}}></Text>
              {masteryLevel == '1' && <Text style={{height: '1.4vh'}}>:   Basic</Text>}
              {masteryLevel == '2' && <Text style={{height: '1.4vh'}}>:   Advanced</Text>}
              {masteryLevel == '3' && <Text style={{height: '1.4vh'}}>:   Mastery</Text>}
            </Description>
          </DescriptionBlock>

          <Text style={{fontSize: '10px', marginTop: '5%'}}>We certify that the following Boys have passed the examination and met the requirements for the above-mentioned award.</Text>

          <CredentialsBlock>
            <CredentialLabel>
              <Text style={{marginTop: '2.4vh'}}>NAME OF EXAMINER</Text>
              <Text style={{marginTop: '2.4vh'}}>SIGNATURE</Text>
              <Text style={{marginTop: '1.2vh'}}>QUALIFICATION</Text>
              <Text style={{marginTop: '1.2vh'}}>NUMBER OF HOURS</Text>
              <Text style={{marginTop: '1.2vh'}}>CONTACT NO.</Text>
              <Text style={{marginTop: '2.4vh'}}>NAME OF CAPTAIN</Text>
              <Text style={{marginTop: '1.2vh'}}>SIGNATURE</Text>
              <Text style={{marginTop: '1.2vh'}}>DATE</Text>
            </CredentialLabel>
            <Credential>
              <Text style={{marginTop: '2.4vh'}}>:   {instructor.rank} {instructor.account_name}</Text>
              <Text style={{marginTop: '2.4vh'}}>:</Text>
              <Text style={{marginTop: '1.2vh'}}>:</Text>
              <Text style={{marginTop: '1.2vh'}}>:</Text>
              <Text style={{marginTop: '1.2vh'}}>:</Text>
              <Text style={{marginTop: '2.4vh'}}>:   LTA SEETOH KAH MENG DAVID</Text>
              <Text style={{marginTop: '1.2vh'}}>:</Text>
              <Text style={{marginTop: '1.2vh'}}>:</Text>
            </Credential>
          </CredentialsBlock>
          </View>
        </Page>
  )
}

export { ManualAwardCertificationPage }