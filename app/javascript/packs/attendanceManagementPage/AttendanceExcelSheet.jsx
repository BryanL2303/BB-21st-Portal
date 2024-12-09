import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const AttendanceExcelSheet = ({year}) => {
  // Mock dataset similar to the uploaded file
  const mockData = {
	headers: [
	  ["", "SEC 1 PLATOON ATTENDANCE", "", "", "", "Date Updated:", "2024-11-21"],
	  ["", "NO.", "MEMBER ID", "BOYS' NAME", "CLASS", "RANK", "TOTAL %"],
	  [],
	],
	rows: [
	  ["", 1, "S123", "John Doe", "1A", "Private", "90%"],
	  ["", 2, "S124", "Jane Smith", "1B", "Corporal", "85%"],
	  ["", 3, "S125", "Sam Wilson", "1C", "Private", "88%"],
	],
  };

  const [tableData, setTableData] = useState(mockData);

  // Function to download the Excel file
  const handleDownload = () => {
	const { headers, rows } = tableData;

	// Combine headers and rows for Excel
	const excelData = [...headers, ...rows];

	// Convert data to worksheet
	const worksheet = XLSX.utils.aoa_to_sheet(excelData);

	// Create a workbook and append the worksheet
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

	// Write workbook to a Blob and trigger download
	const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
	const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
	saveAs(blob, "GeneratedExcel.xlsx");
  };

  return (
	<div>
	  <h1>{year} Attendance</h1>
	  <table border="1" style={{ excelTableStyle }}>
		<thead>
			<tr>
				<th> </th>
				<th colSpan={6}>
					SEC 1 PLATOON ATTENDANCE
				</th>
			</tr>
			<tr></tr>
			<tr>
				<th colSpan={5}> </th>
				<th>
					Date Updated:
				</th>
				<th> 21-Nov-24</th>
			</tr>
			<tr>
				<th> </th>
				<th colSpan={3}>YEAR 2024</th>
				<th colSpan={2}>(Batch 2024)</th>
				<th rowSpan={3}>TOTAL % (weighted)</th>
			</tr>
			<tr>
				<th rowSpan={2}> </th>
				<th rowSpan={2}>NO.</th>
				<th rowSpan={2}>MEMBER ID.</th>
				<th rowSpan={2}>BOYS' NAME</th>
				<th rowSpan={2}>CLASS</th>
				<th rowSpan={2}>RANK</th>
			</tr>
		</thead>
		<tbody>
		  {tableData.rows.map((row, index) => (
			<tr key={index}>
			  {row.map((cell, idx) => (
				<td key={idx} style={excelCellStyle}>
				  {cell}
				</td>
			  ))}
			</tr>
		  ))}
		</tbody>
	  </table>
	</div>
  );
};

const excelTableStyle = {
	borderCollapse: "collapse",
	width: "100%",
	fontFamily: "Arial, sans-serif",
};

const excelCellStyle = {
	border: "1px solid #ccc",
	padding: "8px",
	textAlign: "center",
	backgroundColor: "#f9f9f9",
};

export { AttendanceExcelSheet };