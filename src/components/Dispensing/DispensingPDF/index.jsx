import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  Image,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import { Images } from "../../../assets";
import formatDate from "../../../utils/formatDate";

// Register custom fonts
Font.register({
  family: "Roboto",
  fonts: [
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-light-webfont.ttf",
      fontWeight: 300,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf",
      fontWeight: 400,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-medium-webfont.ttf",
      fontWeight: 500,
    },
    {
      src: "https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf",
      fontWeight: 700,
    },
  ],
});

const styles = StyleSheet.create({
  page: {
    padding: 40,
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottom: "2 solid #328EA3",
    paddingBottom: 20,
  },
  logo: { width: 150, height: 40 },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#328EA3",
  },
  name: {
    fontSize: 14,
    fontWeight: 500,
    color: "#328EA3",
    textAlign: "right",
  },
  section: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 500,
    color: "#328EA3",
    marginBottom: 15,
    borderBottom: "1 solid #ecf0f1",
    paddingBottom: 5,
  },
  detailsGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    width: "50%",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 11,
    color: "#7f8c8d",
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 10,
    color: "#328EA3",
    fontWeight: 500,
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ecf0f1",
    borderRadius: 4,
    marginTop: 5,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    minHeight: 30,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#328EA3",
  },
  tableCol: {
    width: "25%",
    paddingVertical: 3,
    paddingHorizontal: 5,
  },
  tableCell: {
    fontSize: 8,
    color: "#34495e",
  },
  tableCellHeader: {
    color: "#ffffff",
    fontWeight: 700,
  },
  tableColParent: {
    backgroundColor: "#f9f9f9",
  },
  tableCellParent: {
    fontWeight: 500,
  },

  // manual entry
  manualEntrySection: {
    marginTop: 5,
    marginBottom: 5,
  },
  underline: {
    color: "#000000", // Black underline for manual entry
    fontSize: 12, // Adjust the size to match your form style
    letterSpacing: 2, // Space the underline characters a bit more
  },
});

const DispensingPDF = ({ data, userName }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Image style={styles.logo} src={Images.logo} />
        </View>
        <Text style={styles.name}>{userName}</Text>
      </View>
      <DispensingDetailsPDF details={data} />
      <DispensingTablePDF data={data} />
      <ManualEntryFields />
    </Page>
  </Document>
);

const DispensingDetailsPDF = ({ details }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Color Slip</Text>
    <View style={styles.detailsGrid}>
      <DetailItem label="PI No." value={details?.data.piNo || "-"} />
      <DetailItem
        label="Machine"
        value={details?.data.machineId?.name || "-"}
      />
      <DetailItem
        label="Customer"
        value={
          `${details?.data.customerId?.name} - ${details?.data?.customerId.custCode}` ||
          "-"
        }
      />
      <DetailItem
        label="Shade No."
        value={
          `${details?.data.shadeId?.shadeCode} - ${details?.data?.shadeId.color}` ||
          "-"
        }
      />
      <DetailItem label="Slip No." value={details?.data.slipNumber || "-"} />
      <DetailItem
        label="Quality"
        value={
          `${details?.data.qualityId?.qualityCode} - ${details?.data?.qualityId.qualityCodeManual}` ||
          "-"
        }
      />
      <DetailItem label="RM Lot No." value={details?.data.rmLotNumber || "-"} />
      <DetailItem
        label="Batch Weight (kg)"
        value={details?.data.batchWeight || "-"}
      />
      <DetailItem label="Cones Count" value={details?.data.cones || "-"} />
      <DetailItem label="Program No." value={details?.data.programNo || "-"} />
      <DetailItem label="Recipe Type" value={details?.data.recipeType || "-"} />
      <DetailItem
        label="Literage"
        value={details?.data.machineId.literage || "-"}
      />
      <DetailItem
        label="Created At"
        value={ formatDate(details?.data.createdAt || "-")}
      />
    </View>
  </View>
);

const DetailItem = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const DispensingTablePDF = ({ data }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>Chemical Details</Text>
    <View style={styles.table}>
      <TableHeader />
      <TableBody data={data} />
    </View>
  </View>
);

const TableHeader = () => (
  <View style={[styles.tableRow, styles.tableHeader]}>
    <View style={[styles.tableCol, { width: "10%" }]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>Sr no.</Text>
    </View>
    <View style={[styles.tableCol, { width: "30%" }]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>
        Chemical Name
      </Text>
    </View>
    <View style={[styles.tableCol, { width: "15%" }]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>Ratio</Text>
    </View>
    <View style={[styles.tableCol, { width: "15%" }]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>Ratio Unit</Text>
    </View>
    <View style={[styles.tableCol, { width: "15%" }]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>Quantity</Text>
    </View>
    <View style={[styles.tableCol, { width: "15%" }]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>
        Actual Weight
      </Text>
    </View>
  </View>
);



const TableBody = ({ data }) => {
  const calculateQuantity = (child) => {
    const ratio = child?.ratio;
    const literage = data?.data?.machineId?.literage;
    const batchWeight = data?.data?.batchWeight;
    const ratioUnit = child.ratioUnit;
  
    let result = "-";
  
    if (ratioUnit === "g/l") {
      result = ratio * literage;
    } else if (ratioUnit === "%") {
      result = batchWeight * ratio * 10;
    }
  
    // If the result is a number, format it to two decimal places
    if (typeof result === "number") {
      return result.toFixed(2);
    }
  
    return result;
  };
  return (
  <>
    {data?.data.recipeId.parentChemicals.map((parent, index) => (
      <React.Fragment key={index}>
        <View style={[styles.tableRow, styles.tableColParent]}>
          <View style={[styles.tableCol, { width: "10%" }]}>
            <Text style={[styles.tableCell, styles.tableCellParent]}>
              {index + 1}
            </Text>
          </View>
          <View style={[styles.tableCol, { width: "30%" }]}>
            <Text style={[styles.tableCell, styles.tableCellParent]}>
              {parent.templateId.name}
            </Text>
          </View>
          <View style={[styles.tableCol, { width: "15%" }]}>
            <Text style={[styles.tableCell, styles.tableCellParent]}>-</Text>
          </View>
          <View style={[styles.tableCol, { width: "15%" }]}>
            <Text style={[styles.tableCell, styles.tableCellParent]}>-</Text>
          </View>
          <View style={[styles.tableCol, { width: "15%" }]}>
            <Text style={[styles.tableCell, styles.tableCellParent]}>-</Text>
          </View>
          <View style={[styles.tableCol, { width: "15%" }]}>
            <Text style={[styles.tableCell, styles.tableCellParent]}>-</Text>
          </View>
        </View>

        {parent.childChemicals?.map((child, childIndex) => (
          <View style={styles.tableRow} key={`${index}-${childIndex}`}>
            <View style={[styles.tableCol, { width: "10%" }]}>
              <Text style={styles.tableCell}>
                {index + 1}.{childIndex + 1}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "30%" }]}>
              <Text style={styles.tableCell}>
                {child?.chemicalId.name || "-"}
              </Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>{child.ratio || "-"}</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>{child?.ratioUnit || "-"}</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>{calculateQuantity(child)}</Text>
            </View>
            <View style={[styles.tableCol, { width: "15%" }]}>
              <Text style={styles.tableCell}>-</Text>
            </View>
          </View>
        ))}
      </React.Fragment>
    ))}
  </>
)};

const ManualEntryFields = () => (
  <View style={styles.manualEntrySection}>
    <Text style={styles.sectionTitle}></Text>
    <View style={styles.detailsGrid}>
      <DetailItem label="Date:" value=" " />{" "}
      {/* Empty value for manual entry */}
      <DetailItem label="Operator Name:" value=" " />
      <DetailItem label="Shift :" value=" " />
      <DetailItem label="Start Time :" value=" " />
      <DetailItem label="End Time : " value=" " />
      <DetailItem label="Start PH :" value=" " />
      <DetailItem label="End PH :" value=" " />
    </View>
  </View>
);

export default DispensingPDF;
