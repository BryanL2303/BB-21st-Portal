import React, { useState } from 'react';
import PropTypes from 'prop-types'
import { PDFViewer, Document, Page, Text, View, Image, StyleSheet, Font } from '@react-pdf/renderer';
import styled from "@react-pdf/styled-components";

// Styles are written in Pixels
// React takes Points
// Conversion: 1px = 0.75pt

Font.register({
	family: "Arial",
	src: "https://raw.githubusercontent.com/matomo-org/travis-scripts/master/fonts/Arial.ttf",
});

Font.register({
	family: "Arial",
	src: "https://raw.githubusercontent.com/matomo-org/travis-scripts/master/fonts/Arial_Bold.ttf",
	fontWeight: "bold",
});

Font.register({
	family: "Arial",
	src: "https://raw.githubusercontent.com/matomo-org/travis-scripts/master/fonts/Arial_Italic.ttf",
	fontStyle: "italic",
})
  
const styles = StyleSheet.create({
	page: {
		paddingVertical: 20 * 0.75,
		paddingHorizontal: 40 * 0.75,
		gap: 10 * 0.75,
		display: 'flex',
		flexDirection: 'column',
		fontSize: 14 * 0.75,
	},
	section: {
		marginBottom: 10,
	},
	header: {
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		justifyContent: 'space-between',
		paddingBottom: 5 * 0.75,
		borderBottomWidth: 1 * 0.75,
		borderBottomColor: 'black',
		borderBottomStyle: 'solid',
	},
	header_section: {
		display: 'flex',
		width: '100%',
		flexGrow: 1,
		flexDirection: 'row',
		alignItems: 'center',
		flexShrink: 0,
	},
	header_section_img: {
		width: 60 * 0.75,
    	marginRight: 5 * 0.75,
	},
	header_p: {
		textTransform: 'uppercase',
		fontSize: 10 * 0.75,
	},
	bold: {
		fontFamily: 'Arial',
		fontWeight: 'bold',
	},
	header_sup: {
		fontSize: 6 * 0.75,
		marginBottom: 5,
		baselineShift: 5,
	},
	italic: {
		fontFamily: 'Arial',
		fontStyle: 'italic',
	},
	textalign_right: { textAlign: 'right',},
	fontsize_9px: { fontSize: 9 * 0.75, },
	fontsize_16px: { fontSize: 16 * 0.75, },
	fontsize_18px: { fontSize: 18 * 0.75, },
	flexgrow_1: { flexGrow: 1, },
	marginleft_auto: { marginLeft: 'auto', },
	display_flex: { display: 'flex', },
	texttransform_uppercase: { textTransform: 'uppercase', },
	justifycontent_center: { justifyContent: 'center', },
	alignitems_center: { alignItems: 'center', },
	textdecor_underline: { textDecoration: 'underline', },
	gap_5px: { gap: 5 * 0.75, },

	program: {
		width: "100%",
		marginTop: 15,
		marginBottom: 10,
	},
});

const FlexRow = styled.View`
	display: flex;
	flex-direction: row;
`;

const FlexColumn = styled.View`
	display: flex;
	flex-direction: column;
`;

const Footer = styled.View`
	border-top: 1px solid lightgrey;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding-top: 5px;
    margin-top: auto;
    align-items: center;
`;

const ParadeNoticePDF = ({ parade }) => {
	let date = new Date(parade.info.date);
	let dayOfWeek = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(date)
	const [pageWidth, setPageWidth] = useState(null);
	dayOfWeek = dayOfWeek.toUpperCase()

	date = date.toLocaleDateString('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
	});

	const onLoadSuccess = ({ width }) => {
		setPageWidth(width);
	};

	function formatTime(datetimeStr) {
		const date = new Date(datetimeStr.split('.')[0]);
		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: 'numeric',
			hour12: true
		}).format(date);
	}

	return (
		<div>
			<PDFViewer>
				<Document onLoadSuccess={onLoadSuccess}>
					<Page size="A4" style={styles.page} orientation='landscape' scale={pageWidth ? window.innerWidth / pageWidth : 1}>
						<View style={styles.header}>
							<View style={styles.header_section}>
								<Image style={styles.header_section_img} src="/assets/bb-crest-34c67a3e6293d4779a6cc93c1dcec5d5724968d117976abb1651536a0835175d.png"></Image>
							
								<View>
									<Text style={[styles.header_p, styles.bold]}>the boys&apos; brigade in singapore</Text>
									<Text style={[styles.header_p, styles.bold]}>21<Text style={styles.header_sup}>st</Text> company</Text>
									<Text style={styles.header_p}>geylang methodist school (secondary)</Text>
								</View>

								<Text style={[styles.textalign_right, styles.fontsize_9px, styles.marginleft_auto]}>This hope we have as an anchor of out soul, a hope both{"\n"}<Text style={styles.bold}>sure and stedfast</Text> and one which enters within the veil{"\n"}where Jesus has entered as a forerunner for us...{"\n"}<Text style={styles.italic}>Hebrews 6:19-20a</Text></Text>
							</View>
						</View>

						<View style={[styles.display_flex, styles.justifycontent_center, styles.alignitems_center, styles.gap_5px]}>
							<Text style={[styles.texttransform_uppercase, styles.bold, styles.fontsize_18px, styles.textdecor_underline]}>parade notice</Text>
							<Text style={[styles.texttransform_uppercase, styles.bold, styles.fontsize_16px]}>{date}, {dayOfWeek}</Text>
						</View>

						<View style={{ display: 'flex', flexDirection: 'column', gap: 2 * 0.75 }}>
							<FlexRow>
								<FlexRow style={{ gap: 5 * 0.75 }}>
									<Text>Venue:</Text>
									<Text style={styles.bold}>{parade.info.venue}</Text>
								</FlexRow>
							</FlexRow>

							<FlexRow style={{ gap: 50 * 0.75 }}>
								<FlexRow style={{ gap: 5 * 0.75 }}>
									<Text>Reporting Time:</Text>
									<Text style={styles.bold}>{formatTime(parade.info.reporting_time)}</Text>
								</FlexRow>

								<FlexRow style={{ gap: 5 * 0.75 }}>
									<Text>Dismissal Time:</Text>
									<Text style={styles.bold}>{formatTime(parade.info.dismissal_time)}</Text>
								</FlexRow>
							</FlexRow>
						</View>

						<View style={{ marginTop: 10 * 0.75 }}>
							<FlexColumn>
								<FlexRow>
									<FlexRow style={{ width: 300 * 0.75, gap: 5 * 0.75, borderRight: '1px solid #000' }}>
										<Text style={[styles.bold, { width: 92 * 0.75, textAlign: 'right' }]}>Duty Teacher:</Text>
										<Text>{parade.dt?.honorifics} {parade.dt?.abbreviated_name}</Text>
									</FlexRow>
									<FlexRow style={{ width: 300 * 0.75, gap: 5 * 0.75, marginLeft: 15 * 0.75 }}>
										<Text style={[styles.bold, { width: 85 * 0.75, textAlign: 'right' }]}>COS:</Text>
										<Text>{parade.cos?.rank} {parade.cos?.account_name}</Text>
									</FlexRow>
									<FlexRow style={{ width: 300 * 0.75, gap: 5 * 0.75, marginLeft: 15 * 0.75 }}>
										<Text style={[styles.bold, { width: 35 * 0.75, textAlign: 'right' }]}>CSM:</Text>
										<Text>{parade.csm?.rank} {parade.csm?.account_name}</Text>
									</FlexRow>
								</FlexRow>

								<FlexRow>
									<FlexRow style={{ width: 300 * 0.75, gap: 5 * 0.75, borderRight: '1px solid #000' }}>
										<Text style={[styles.bold, { width: 92 * 0.75, textAlign: 'right' }]}>Duty Officer:</Text>
										{parade.do?.rank != 'Teacher' && parade.do?.rank != 'VAL' && <Text>{parade.do?.rank ? parade.do?.rank : parade.do?.honorifics} {parade.do?.abbreviated_name}</Text>}
										{(parade.do?.class == 'Staff' || parade.do?.rank == 'VAL') && <Text>{parade.do?.honorifics} {parade.do?.abbreviated_name}</Text>}
									</FlexRow>
									<FlexRow style={{ width: 300 * 0.75, gap: 5 * 0.75, marginLeft: 15 * 0.75 }}>
										<Text style={[styles.bold, { width: 85 * 0.75, textAlign: 'right' }]}>Flag Bearer:</Text>
										<Text>{parade.flag_bearer?.rank} {parade.flag_bearer?.account_name}</Text>
									</FlexRow>
									<FlexRow style={{ width: 300 * 0.75, gap: 5 * 0.75, marginLeft: 15 * 0.75 }}>
										<Text style={[styles.bold, { width: 35 * 0.75, textAlign: 'right' }]}>CE:</Text>
										<Text>{parade.ce?.rank} {parade.ce?.account_name}</Text>
									</FlexRow>
								</FlexRow>
							</FlexColumn>
						</View>

						<View style={{ marginTop: 10 * 0.75 }}>
							<Text style={[styles.bold, { textDecoration: 'underline', marginBottom: 5 * 0.75 }]}>Company Announcements</Text>

							<View style={styles.announcement}>
								{parade.company_announcements.length > 0 ? (
									parade.company_announcements.map((announcement, index) => (
										<Text style={{ fontSize: 13 * 0.75, lineHeight: 1.2 }} key={index}>
											{index + 1}) {announcement.announcement}
										</Text>
									))
								) : (
									<Text>No Company Announcements</Text>
								)}
							</View>
						</View>

						<View style={{ marginTop: 10 * 0.75 }}>
							<FlexRow style={{ borderTop: '1px solid #000' }}>
								<FlexRow style={{ width: '50%' }}>
									<FlexColumn style={{ borderRight: '1px dotted #000', width: '62%', paddingHorizontal: 5 * 0.75, paddingVertical: 5 * 0.75 }}>
										<Text style={[styles.bold, { fontSize: 16 * 0.75, marginBottom: 5 * 0.75 }]}>SEC 1 PLATOON</Text>
										<Text style={{ textDecoration: 'underline', marginBottom: 2 * 0.75 }}>Program</Text>
										{parade.platoon_programs['1'].map((program) => {
											return (
												<FlexRow key={program.id}>
													<Text>{program.start_time.slice(11, 16)} - {program.end_time.slice(11, 16)}: {program.program}</Text>
												</FlexRow>
											)
										})}
									</FlexColumn>

									<FlexColumn style={{ borderRight: '2px solid #000', width: '38%', paddingHorizontal: 5 * 0.75, paddingVertical: 5 * 0.75 }}>
										<Text style={[styles.bold, { textDecoration: 'underline', marginBottom: 5 * 0.75 }]}>Platoon Announcements</Text>
										<FlexRow style={{ gap: 3 * 0.75 }}>
											<Text>Attire:</Text>
											<Text>{parade.info.sec_1_attire}</Text>
										</FlexRow>
										{parade.platoon_announcements['1'].map((announcement, index) => (
											<Text style={{ fontSize: 13 * 0.75, lineHeight: 1.2 }} key={index}>
												{String.fromCharCode(index + 97)}) {announcement.announcement}
											</Text>
										))}
									</FlexColumn>
								</FlexRow>

								<FlexRow style={{ width: '50%' }}>
									<FlexColumn style={{ borderRight: '1px dotted #000', width: '62%', paddingHorizontal: 5 * 0.75, paddingVertical: 5 * 0.75 }}>
										<Text style={[styles.bold, { fontSize: 16 * 0.75, marginBottom: 5 * 0.75 }]}>SEC 2 PLATOON </Text>
										<Text style={{ textDecoration: 'underline', marginBottom: 2 * 0.75 }}>Program </Text>
										{parade.platoon_programs['2'].map((program) => (
											<FlexRow key={program.id}>
												<Text>{program.start_time.slice(11, 16)} - {program.end_time.slice(11, 16)}: {program.program}</Text>
											</FlexRow>
										))}
									</FlexColumn>

									<FlexColumn style={{ width: '38%', paddingHorizontal: 5 * 0.75, paddingVertical: 5 * 0.75 }}>
										<Text style={[styles.bold, { textDecoration: 'underline', marginBottom: 5 * 0.75 }]}>Platoon Announcements</Text>
										<FlexRow style={{ gap: 3 * 0.75 }}>
											<Text>Attire:</Text>
											<Text>{parade.info.sec_2_attire}</Text>
										</FlexRow>
										{parade.platoon_announcements['2'].map((announcement, index) => (
											<Text style={{ fontSize: 13 * 0.75, lineHeight: 1.2 }} key={index}>
												{String.fromCharCode(index + 97)}) {announcement.announcement}
											</Text>
										))}
									</FlexColumn>
								</FlexRow>
							</FlexRow>
						</View>

						<View style={{ marginTop: 30 * 0.75 }}>
							<FlexRow style={{ borderTop: '1px solid #000' }}>
								<FlexRow style={{ width: '50%' }}>
									<FlexColumn style={{ borderRight: '1px dotted #000', width: '62%', paddingHorizontal: 5 * 0.75, paddingVertical: 5 * 0.75 }}>
										<Text style={[styles.bold, { fontSize: 16 * 0.75, marginBottom: 5 * 0.75 }]}>SEC 3 PLATOON</Text>
										<Text style={{ textDecoration: 'underline', marginBottom: 2 * 0.75 }}>Program</Text>
										{parade.platoon_programs['3'].map((program) => {
											return (
												<FlexRow key={program.id}>
													<Text>{program.start_time.slice(11, 16)} - {program.end_time.slice(11, 16)}: {program.program}</Text>
												</FlexRow>
											)
										})}
									</FlexColumn>

									<FlexColumn style={{ borderRight: '2px solid #000', width: '38%', paddingHorizontal: 5 * 0.75, paddingVertical: 5 * 0.75 }}>
										<Text style={[styles.bold, { textDecoration: 'underline', marginBottom: 5 * 0.75 }]}>Platoon Announcements</Text>
										<FlexRow style={{ gap: 3 * 0.75 }}>
											<Text>Attire:</Text>
											<Text>{parade.info.sec_3_attire}</Text>
										</FlexRow>
										{parade.platoon_announcements['3'].map((announcement, index) => (
											<Text style={{ fontSize: 13 * 0.75, lineHeight: 1.2 }} key={index}>
												{String.fromCharCode(index + 97)}) {announcement.announcement}
											</Text>
										))}
									</FlexColumn>
								</FlexRow>

								<FlexRow style={{ width: '50%' }}>
									<FlexColumn style={{ borderRight: '1px dotted #000', width: '62%', paddingHorizontal: 5 * 0.75, paddingVertical: 5 * 0.75 }}>
										<Text style={[styles.bold, { fontSize: 16 * 0.75, marginBottom: 5 * 0.75 }]}>SEC 4/5 PLATOON </Text>
										<Text style={{ textDecoration: 'underline', marginBottom: 2 * 0.75 }}>Program</Text>
										{parade.platoon_programs['4/5'].map((program) => (
											<FlexRow key={program.id}>
												<Text>{program.start_time.slice(11, 16)} - {program.end_time.slice(11, 16)}: {program.program}</Text>
											</FlexRow>
										))}
									</FlexColumn>

									<FlexColumn style={{ width: '38%', paddingHorizontal: 5 * 0.75, paddingVertical: 5 * 0.75 }}>
										<Text style={[styles.bold, { textDecoration: 'underline', marginBottom: 5 * 0.75 }]}>Platoon Announcements</Text>
										<FlexRow style={{ gap: 3 * 0.75 }}>
											<Text>Attire:</Text>
											<Text>{parade.info.sec_4_5_attire}</Text>
										</FlexRow>
										{parade.platoon_announcements['4/5'].map((announcement, index) => (
											<Text style={{ fontSize: 13 * 0.75, lineHeight: 1.2 }} key={index}>
												{String.fromCharCode(index + 97)}) {announcement.announcement}
											</Text>
										))}
									</FlexColumn>
								</FlexRow>
							</FlexRow>
						</View>

						<Footer> 
							<Text style={{ fontSize: 12 * 0.75 }}>Page | 1 of 1</Text>
							<Text style={{ fontSize: 12 * 0.75 }}>Version 2025_v1.0</Text>
						</Footer>
					</Page>
				</Document>
			</PDFViewer>
			<br />
			<br />
			<label htmlFor='parade-description'>Description:</label>
			<br />
			<textarea disabled={true} value={parade.info.description} id='parade-description'></textarea>
		</div>)
};

ParadeNoticePDF.propTypes = {
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
			description: PropTypes.string,
		}),
		parade_attendance: PropTypes.objectOf(
			PropTypes.shape({
				id: PropTypes.number.isRequired,
				parade_id: PropTypes.number.isRequired,
				account_id: PropTypes.number.isRequired,
				attendance: PropTypes.string.isRequired,
				level: PropTypes.oneOfType([PropTypes.number, PropTypes.oneOf([null])]),
			})
		),
		company_announcements: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.number.isRequired,
				parade_id: PropTypes.number.isRequired,
				announcement: PropTypes.string.isRequired,
				created_at: PropTypes.string.isRequired,
				updated_at: PropTypes.string,
			})
		),
		platoon_announcements: PropTypes.objectOf(
			PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.number.isRequired,
					parade_id: PropTypes.number.isRequired,
					level: PropTypes.string.isRequired,
					announcement: PropTypes.string.isRequired,
					created_at: PropTypes.string.isRequired,
					updated_at: PropTypes.string,
				})
			)
		),
		platoon_programs: PropTypes.objectOf(
			PropTypes.arrayOf(
				PropTypes.shape({
					id: PropTypes.number.isRequired,
					created_at: PropTypes.string.isRequired,
					end_time: PropTypes.string.isRequired,
					level: PropTypes.string.isRequired,
					parade_id: PropTypes.number.isRequired,
					program: PropTypes.string.isRequired,
					start_time: PropTypes.string.isRequired,
					updated_at: PropTypes.string,
				})
			)
		),
		ce: PropTypes.shape({
			account_name: PropTypes.string,
			rank: PropTypes.string,
		}),
		flag_bearer: PropTypes.shape({
			account_name: PropTypes.string,
			rank: PropTypes.string,
		}),
		cos: PropTypes.shape({
			account_name: PropTypes.string,
			rank: PropTypes.string,
		}),
		csm: PropTypes.shape({
			account_name: PropTypes.string,
			rank: PropTypes.string,
		}),
		dt: PropTypes.shape({
			abbreviated_name: PropTypes.string,
			honorifics: PropTypes.string,
		}),
		do: PropTypes.shape({
			account_name: PropTypes.string,
			abbreviated_name: PropTypes.string,
			class: PropTypes.string,
			honorifics: PropTypes.string,
			rank: PropTypes.string,
		}),
	}),
}

export { ParadeNoticePDF };
