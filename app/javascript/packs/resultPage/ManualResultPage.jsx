import React, { useEffect, useState } from 'react'
import { PDFViewer, Document, Text, Page, View, Image, StyleSheet } from '@react-pdf/renderer';
import styled from "@react-pdf/styled-components";
import PropTypes from 'prop-types'
import axios from 'axios'

/*For officers/primers to generate results
*/
const ManualResultPage = ({award, mastery, instructorId, boys, customDescription, columns, columnContents}) => {
  const [instructor, setInstructor] = useState();
  let date = new Date();
  const formattedDate = date.toLocaleDateString('en-GB');

  //If there is no ongoing session go back to log in page
  axios.post("/application/0/check_session", {}, {
    withCredentials: true
  })
  .then()
  .catch(() => {window.location.href = '/'})

  useEffect(() => {
    //make axios call and set states
    axios.post('/api/account/' + instructorId + '/get_account', {
      'id': instructorId
    }, {
      withCredentials: true  // Include credentials (cookies)
    })
    .then(resp => {
      setInstructor(resp.data)
    })
    .catch(error => {console.log(error)})
  }, [])

  const styles = StyleSheet.create({
    viewer: {
      width: '100%',
      height: '79vh',
    },
    logo: {
      height: '4vh'
    },
    text: {
      color: '#228b22',
    }
  });

  const Header = styled.View`
    width: 90%;
    margin-left: 5%;
    margin-top: 2%;
    flex-wrap: nowrap;
    display: flex;
    flex-direction: row;
    align-content: flex-start;

    /* hack to get bottom border */
    border: 1px solid #000000;
    border-top: 1px none;
    border-left: 1px none;
    border-right: 1px none;
  `;

  const HeaderText = styled.View`
    width: 100%;
    flex-wrap: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: flex-start;
  `;

  const HeaderLogoColumn = styled.View`
    display: flex;
    flex-direction: column;
    /* border: 1px solid #a8026f; */
    font-size: 7px;
  `;

  const HeaderLogoRow = styled.View`
    display: flex;
    flex-direction: row;
  `;

  const HeaderVerseColumn = styled.View`
    display: flex;
    flex-direction: column;
    /* border: 1px solid #a8026f; */
    font-size: 5px;
  `;

  const HeaderVerseRow = styled.View`
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
  `;

  const DescriptionBlock = styled.View`
    width: 90%;
    margin-left: 5%;
    margin-top: 4%;
    flex-wrap: nowrap;
    display: flex;
    flex-direction: row;
    align-content: flex-start;
  `;

  const Label = styled.View`
    width: 15%;
    display: flex;
    flex-direction: column;
    text-align: right;
    font-size: 9px;
  `;

  const Description = styled.View`
    margin-left: 2%;
    display: flex;
    width: 85%;
    flex-direction: column;
    align-content: flex-start;
    font-size: 9px;
  `;

  const Table = styled.View`
    width: 90%;
    margin-left: 5%;
    margin-top: 4%;
    border: 1px solid #000000;
    border-top: 1px none;
    border-right: 1px none;
    flex-wrap: nowrap;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
  `;

  const TableHeaderRow = styled.View`
    display: flex;
    flex-direction: row;
    background-color: #B8D5D9;
    height: 3vh;
    border-top: 1px solid #000000;
  `;
  
  const TableRow = styled.View`
    display: flex;
    flex-direction: row;
    height: 2vh;
    border-top: 1px solid #000000;
  `;

  const TableNumberColumn = styled.View`
    width: 10%;
    text-align: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #000000;
    font-size: 9px;
  `;

  const TableNameHeaderColumn = styled.View`
    width: 50%;
    text-align: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #000000;
    font-size: 9px;
  `;

  const TableNameColumn = styled.View`
    width: 50%;
    padding-left: 1%;
    text-align: left;
    justify-content: center;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #000000;
    font-size: 9px;
  `;

  const TableLevelColumn = styled.View`
    width: 20%;
    text-align: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #000000;
    font-size: 9px;
  `;

  const TableResultColumn = styled.View`
    width: 20%;
    text-align: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #000000;
    font-size: 9px;
  `;

  const SignatureBlock = styled.View`
    width: 15%;
    margin-left: 5%;
    position: absolute;
    bottom: 20%;

    border-top: 1px solid #000000;
  `;

  const CredentialsColumn = styled.View`
    width: 90%;
    height: 5%;
    margin-left: 5%;
    position: absolute;
    bottom: 15%;
    flex-wrap: nowrap;
    display: flex;
    flex-direction: column;
    align-content: flex-start;
    font-size: 9px;
  `;

  const Footer = styled.View`
    width: 90%;
    margin-left: 5%;
    position: absolute;
    bottom: 2%;
    flex-wrap: nowrap;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-content: flex-start;

    border-top: 1px solid #D3D3D3;
  `;

  const FooterPageColumn = styled.View`
    display: flex;
    flex-direction: column;
    /* border: 1px solid #a8026f; */
    font-size: 7px;
  `;

    const FooterVersionColumn = styled.View`
    display: flex;
    flex-direction: column;
    /* border: 1px solid #a8026f; */
    font-size: 7px;
  `;

  return(
    <div className="result-page">
    {award != null && instructor != null && <PDFViewer style={styles.viewer}>
      <Document>
        <Page>
          <View>
            <Header>              
              <Image style={styles.logo} src="/packs/media/packs/general/bb-crest-7106b85f04ce6829d39a973203d05a81.png"></Image>
              <HeaderText>
                <HeaderLogoColumn>
                  <HeaderLogoRow>
                    <Text style={{fontFamily: 'Times-Bold'}}>THE BOYS&apos; BRIGADE</Text>
                  </HeaderLogoRow>
                  <HeaderLogoRow>
                    <Text style={{fontFamily: 'Times-Bold'}}>21st SINGAPORE COMPANY</Text>
                  </HeaderLogoRow>
                  <HeaderLogoRow>
                    <Text>GEYLANG METHODIST SCHOOL</Text>
                  </HeaderLogoRow>
                  <HeaderLogoRow>
                    <Text>(SECONDARY)</Text>
                  </HeaderLogoRow>
                </HeaderLogoColumn>
                <HeaderVerseColumn>
                  <HeaderVerseRow>
                    <Text>This hope we have as an anchor of the soul, a hope both</Text>
                  </HeaderVerseRow>
                  <HeaderVerseRow>
                    <Text style={{fontFamily: 'Times-Bold'}}>sure and stedfast</Text> <Text> and one which enters within the veil</Text>
                  </HeaderVerseRow>
                  <HeaderVerseRow>
                    <Text>where Jesus has entered as a forerunner for us...</Text>
                  </HeaderVerseRow>
                  <HeaderVerseRow>
                    <Text>Hebrews 6:19-20a</Text>
                  </HeaderVerseRow>
                </HeaderVerseColumn>
              </HeaderText>
            </Header>
          </View>

          <Text style={{fontFamily: 'Times-Bold', textAlign: 'center', marginTop: '2%'}}>RESULTS</Text>
          <DescriptionBlock>
            <Label>
              <Text>BADGE:</Text>
              <Text>DATE:</Text>
              <Text>DESCRIPTION:</Text>
            </Label>
            <Description>
              {mastery == null && <Text style={{fontFamily: 'Times-Bold'}}>{award.badge_name}</Text>}
              {mastery != null && <Text style={{fontFamily: 'Times-Bold'}}>{award.badge_name} {mastery.mastery_name}</Text>}
              <Text style={{fontFamily: 'Times-Bold'}}>{formattedDate}</Text>
              {customDescription != null && <Text>{customDescription}</Text>}
              {mastery == null && customDescription == null && <Text>{award.results_description}</Text>}
              {mastery != null && customDescription == null && <Text>{mastery.results_description}</Text>}
            </Description>
          </DescriptionBlock>

          <Table>
            <TableHeaderRow style={{fontFamily: 'Times-Bold'}}>
              <TableNumberColumn>
                <Text>No.</Text>
              </TableNumberColumn>
              <TableNameHeaderColumn>
                <Text>Name</Text>
              </TableNameHeaderColumn>
              <TableLevelColumn>
                <Text>Level</Text>
              </TableLevelColumn>
              {columns.map((column) => {
                return (
                  <TableLevelColumn key={column.id + "-column"}>
                    <Text>{column.column_title}</Text>
                  </TableLevelColumn>
                )
              })}
              <TableResultColumn>
                <Text>Pass/Fail</Text>
              </TableResultColumn>
            </TableHeaderRow>
            {boys.map((boy, index) => {
              return(
                <TableRow key={boy.id}>
                  <TableNumberColumn>
                    <Text>{index + 1}</Text>
                  </TableNumberColumn>
                  <TableNameColumn>
                    <Text>{boy.account_name}</Text>
                  </TableNameColumn>
                  <TableLevelColumn>
                    <Text>Sec {boy.level}</Text>
                  </TableLevelColumn>
                  {columns.map((column) => {
                    return (
                      <TableLevelColumn key={column.id + "-row-column"}>
                        <Text>{columnContents[column.column_title][index]}</Text>
                      </TableLevelColumn>
                    )
                  })}
                  <TableResultColumn>
                    <Text style={{fontFamily: 'Times-Bold'}}>Pass</Text>
                  </TableResultColumn>
                </TableRow>
              )
            })}
          </Table>

          <SignatureBlock></SignatureBlock>
          <CredentialsColumn>
            <Text>Chief Instructor/Assessor&apos;s Signature</Text>
            <Text>Name: {instructor.account_name}</Text>
            <Text>Credentials: {instructor.credentials}, BB 21st Singapore Company</Text>
          </CredentialsColumn>

          <Footer>
            <FooterPageColumn>
              <Text>Page | 1 of 1</Text>
            </FooterPageColumn>
            <FooterVersionColumn>
              <Text>For 32A Submission | 2022 v1</Text>
            </FooterVersionColumn>
          </Footer>
        </Page>
      </Document>
    </PDFViewer>}
  </div>
  )
}

ManualResultPage.propTypes = PropTypes.shape({
  award: PropTypes.shape({
    badge_name: PropTypes.string.isRequired,
    results_description: PropTypes.string.isRequired
  }),
  mastery: PropTypes.shape({
    mastery_name: PropTypes.string.isRequired,
    results_description: PropTypes.string.isRequired
  }),
  columns: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    column_title: PropTypes.string.isRequired
  })),
  boy: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    account_name: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired
  }))
})

export { ManualResultPage }