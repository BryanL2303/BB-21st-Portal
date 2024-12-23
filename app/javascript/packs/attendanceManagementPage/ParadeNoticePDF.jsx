import React from 'react';
import PropTypes from 'prop-types'
import { PDFViewer, Document, Page, Text, View, Image, StyleSheet } from '@react-pdf/renderer';
import styled from "@react-pdf/styled-components";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 30,
    fontSize: 8,
  },
  section: {
    marginBottom: 10,
  },
  header: {
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
  },
  logo: {
    height: '4vh'
  },
  subHeader: {
    fontSize: 8,
    marginBottom: 10,
  },
  announcement: {
    marginBottom: 5,
  },
  program: {
    marginTop: 15,
    marginBottom: 10,
  },
});

const Header = styled.View`
  width: 100%;
  margin-left: 0%;
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

const FlexRow = styled.View`
  display: flex;
  flex-direction: row;
`;

const FlexColumn = styled.View`
  display: flex;
  flex-direction: column;
  margin-left: 2px;
`;

const Footer = styled.View`
  width: 90%;
  margin-left: 0%;
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

const ParadeNoticePDF = ({parade}) => {
  let date = new Date(parade.info.date);
  let dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date)
  dayOfWeek = dayOfWeek.toUpperCase()

  date = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  function formatTime(datetimeStr) {
    const date = new Date(datetimeStr.split('.')[0]);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  }

  return(
  <div>
    <PDFViewer width="98%" height="800">
      <Document>
        <Page size="A4" style={styles.page} orientation='landscape'>
          <View>
            <Header>              
              <Image style={styles.logo} src="/packs/media/packs/general/bb-crest-7106b85f04ce6829d39a973203d05a81.png"></Image>
              <HeaderText>
                <HeaderLogoColumn>
                  <HeaderLogoRow>
                    <Text style={{fontFamily: 'Times-Bold'}}>THE BOYS&apos; BRIGADE IN SINGAPORE</Text>
                  </HeaderLogoRow>
                  <HeaderLogoRow>
                    <Text style={{fontFamily: 'Times-Bold'}}>21st COMPANY</Text>
                  </HeaderLogoRow>
                  <HeaderLogoRow>
                    <Text>GEYLANG METHODIST SCHOOL (SECONDARY)</Text>
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

          <View style={styles.header}>
            <Text style={{fontFamily: 'Times-Bold', textDecoration: 'underline'}}>PARADE NOTICE</Text>
            <Text style={{fontFamily: 'Times-Bold'}}>{date}, {dayOfWeek}</Text>
          </View>
          
          <View style={styles.section}>
            <FlexRow>
              <FlexColumn style={{width: '15%'}}>
                <FlexRow>
                  <Text>Venue: </Text> <Text style={{fontFamily: 'Times-Bold'}}>{parade.info.venue}</Text>
                </FlexRow>
                <FlexRow>
                  <Text>Reporting Time: </Text> <Text style={{fontFamily: 'Times-Bold'}}>{formatTime(parade.info.reporting_time)}</Text>
                </FlexRow>
              </FlexColumn>

              <FlexColumn style={{width: '15%'}}>
                <FlexRow>
                  <Text> </Text>
                </FlexRow>
                <FlexRow>
                  <Text>Dismissal Time: </Text> <Text style={{fontFamily: 'Times-Bold'}}>{formatTime(parade.info.dismissal_time)}</Text>
                </FlexRow>
              </FlexColumn>
            </FlexRow>
          </View>

          <View style={styles.section}>
            <FlexRow>
              <FlexColumn style={{width: '7%', alignItems: 'flex-end'}}>
                  <Text style={{fontFamily: 'Times-Bold'}}>Duty Teacher: </Text>
                  <Text style={{fontFamily: 'Times-Bold'}}>Duty Officer: </Text>
              </FlexColumn>
              <FlexColumn style={{borderRight: '1px solid #000', width: '13%', alignItems: 'flex-start'}}>
                  <Text>{parade.dt?.honorifics} {parade.dt?.abbreviated_name}</Text>
                  {parade.do?.rank != 'Teacher' && parade.do?.rank != 'VAL' && <Text>{parade.do?.rank} {parade.do?.account_name}</Text>}
                  {(parade.do?.rank == 'Teacher' || parade.do?.rank == 'VAL') && <Text>{parade.do?.honorifics} {parade.do?.abbreviated_name}</Text>}
              </FlexColumn>

              <FlexColumn style={{width: '7%', alignItems: 'flex-end'}}>
                <Text style={{fontFamily: 'Times-Bold'}}>COS: </Text>
                <Text style={{fontFamily: 'Times-Bold'}}>Flag Bearer: </Text>
              </FlexColumn>
              <FlexColumn style={{width: '13%', alignItems: 'flex-start'}}>
                <Text>{parade.cos?.rank} {parade.cos?.account_name}</Text>
                <Text>{parade.flag_bearer?.rank} {parade.flag_bearer?.account_name}</Text>
              </FlexColumn>

              <FlexColumn style={{width: '7%', alignItems: 'flex-end'}}>
                <Text style={{fontFamily: 'Times-Bold'}}>CSM: </Text>
                <Text style={{fontFamily: 'Times-Bold'}}>CE: </Text>
              </FlexColumn>
              <FlexColumn style={{width: '13%', alignItems: 'flex-start'}}>
                <Text>{parade.csm?.rank} {parade.csm?.account_name}</Text>
                <Text>{parade.ce?.rank} {parade.ce?.account_name}</Text>
              </FlexColumn>
            </FlexRow>
          </View>

          <View style={styles.subHeader}>
            <Text style={{fontFamily: 'Times-Bold', textDecoration: 'underline'}}>Company Announcements</Text>
          </View>
          <View style={styles.announcement}>
            {parade.company_announcements.map((announcement, index) => {
              return(<Text key={index}>{index + 1}{')'} {announcement.announcement}</Text>)
            })}
          </View>

          <View style={styles.program}>
            <FlexRow style={{borderTop: '1px solid #000'}}>
              <FlexColumn style={{borderRight: '1px dotted #000', width: '30%', marginLeft: '2px'}}>
                <Text style={{fontFamily: 'Times-Bold'}}>SEC 1 PLATOON </Text>
                <Text style={{textDecoration: 'underline'}}>Program </Text>
                {parade.platoon_programs['1'].map((program) => {
                  return(
                    <FlexRow index={program.id}>
                      <Text>{program.start_time.slice(11, 16)} - {program.end_time.slice(11, 16)}: {program.program}</Text>
                    </FlexRow>
                  )
                })}
              </FlexColumn>
              
              <FlexColumn style={{borderRight: '2px solid #000', width: '20%', marginLeft: '2px'}}>
                <Text style={{textDecoration: 'underline'}}>Platoon Announcements</Text>
                <FlexRow>
                  <Text style={{fontFamily: 'Times-Bold'}}>Attire: </Text> <Text>{parade.info.sec_1_attire}</Text>
                </FlexRow>
                {parade.platoon_announcements['1'].map((announcement, index) => {
                  return(<Text key={index}>{String.fromCharCode(index + 97)}{')'} {announcement.announcement}</Text>)
                })}
              </FlexColumn>

              <FlexColumn style={{borderRight: '1px dotted #000', width: '30%', marginLeft: '2px'}}>
                <Text style={{fontFamily: 'Times-Bold'}}>SEC 2 PLATOON </Text>
                <Text style={{textDecoration: 'underline'}}>Program </Text>
                {parade.platoon_programs['2'].map((program) => {
                  return(
                    <FlexRow index={program.id}>
                      <Text>{program.start_time.slice(11, 16)} - {program.end_time.slice(11, 16)}: {program.program}</Text>
                    </FlexRow>
                  )
                })}
              </FlexColumn>
              
              <FlexColumn style={{width: '20%', marginLeft: '2px'}}>
                <Text style={{textDecoration: 'underline'}}>Platoon Announcements</Text>
                <FlexRow>
                  <Text style={{fontFamily: 'Times-Bold'}}>Attire: </Text> <Text>{parade.info.sec_2_attire}</Text>
                </FlexRow>
                {parade.platoon_announcements['2'].map((announcement, index) => {
                  return(<Text key={index}>{String.fromCharCode(index + 97)}{')'} {announcement.announcement}</Text>)
                })}
              </FlexColumn>
            </FlexRow>
          </View>
          <View style={styles.program}>
            <FlexRow style={{borderTop: '1px solid #000'}}>
              <FlexColumn style={{borderRight: '1px dotted #000', width: '30%'}}>
                <Text style={{fontFamily: 'Times-Bold'}}>SEC 3 PLATOON </Text>
                <Text style={{textDecoration: 'underline'}}>Program </Text>
                {parade.platoon_programs['3'].map((program) => {
                  return(
                    <FlexRow key={program.id}>
                      <Text>{program.start_time.slice(11, 16)} - {program.end_time.slice(11, 16)}: {program.program}</Text>
                    </FlexRow>
                  )
                })}
              </FlexColumn>
              
              <FlexColumn style={{borderRight: '2px solid #000', width: '20%'}}>
                <Text style={{textDecoration: 'underline'}}>Platoon Announcements</Text>
                <FlexRow>
                  <Text style={{fontFamily: 'Times-Bold'}}>Attire: </Text> <Text>{parade.info.sec_3_attire}</Text>
                </FlexRow>
                {parade.platoon_announcements['3'].map((announcement, index) => {
                  return(<Text key={index}>{String.fromCharCode(index + 97)}{')'} {announcement.announcement}</Text>)
                })}
              </FlexColumn>

              <FlexColumn style={{borderRight: '1px dotted #000', width: '30%'}}>
                <Text style={{fontFamily: 'Times-Bold'}}>SEC 4/5 PLATOON </Text>
                <Text style={{textDecoration: 'underline'}}>Program </Text>
                {parade.platoon_programs['4/5'].map((program) => {
                  return(
                    <FlexRow key={program.id}>
                      <Text>{program.start_time.slice(11, 16)} - {program.end_time.slice(11, 16)}: {program.program}</Text>
                    </FlexRow>
                  )
                })}
              </FlexColumn>
              
              <FlexColumn style={{width: '20%'}}>
                <Text style={{textDecoration: 'underline'}}>Platoon Announcements</Text>
                <FlexRow>
                  <Text style={{fontFamily: 'Times-Bold'}}>Attire: </Text> <Text>{parade.info.sec_4_5_attire}</Text>
                </FlexRow>
                {parade.platoon_announcements['4/5'].map((announcement, index) => {
                  return(<Text key={index}>{String.fromCharCode(index + 97)}{')'} {announcement.announcement}</Text>)
                })}
              </FlexColumn>
            </FlexRow>
          </View>
          
          <Footer>
            <FooterPageColumn>
              <Text>Page | 1 of 1</Text>
            </FooterPageColumn>
            <FooterVersionColumn>
              <Text>Version 2025_v1.0</Text>
            </FooterVersionColumn>
          </Footer>
        </Page>
      </Document>
    </PDFViewer>
    <br/>
    <br/>
    <label>Description:</label>
    <br/>
    <textarea disabled={true} value={parade.info.description}/>
  </div>)
};

ParadeEditor.propTypes = {
  parade: PropTypes.shape({
    info: PropTypes.shape({
      date: PropTypes.string,
      venue: PropTypes.string,
      sec_1_attire: PropTypes.string,
      sec_2_attire: PropTypes.string,
      sec_3_attire: PropTypes.string,
      sec_4_5_attire: PropTypes.string,
      reporting_time: PropTypes.string,
      dismissal_time: PropTypes.string,
      cos_finalized: PropTypes.bool,
      csm_finalized: PropTypes.bool,
      do_finalized: PropTypes.bool,
      captain_finalized: PropTypes.bool,
    }),
    parade_attendance: PropTypes.arrayOf(),
    company_announcements: PropTypes.arrayOf(),
    platoon_announcements: PropTypes.arrayOf(),
    platoon_programs: PropTypes.arrayOf(),
    cos: PropTypes.shape({
      account_name: PropTypes.string,
    }),
    csm: PropTypes.shape({
      account_name: PropTypes.string,
    }),
    do: PropTypes.shape({
      account_name: PropTypes.string,
    }),
  }),
}

export { ParadeNoticePDF };
