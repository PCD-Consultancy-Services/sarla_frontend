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
    padding: 15,
    backgroundColor: "#ffffff",
    fontFamily: "Roboto",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    borderBottom: "2 solid #328EA3",
    paddingBottom: 10,
  },
  logo: { width: 130, height: 30 },
  title: {
    fontSize: 28,
    fontWeight: 700,
    color: "#328EA3",
  },
  name: {
    fontSize: 10,
    fontWeight: 500,
    color: "#328EA3",
    textAlign: "right",
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 600,
    color: "#328EA3",
    marginBottom: 10,
    borderBottom: "1.5 solid #ecf0f1",
    paddingBottom: 5,
  },
  detailsGrid: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
  },
  detailItem: {
    width: "50%",
    marginBottom: 8,
    paddingRight: 10,
  },
  detailLabel: {
    fontSize: 8,
    color: "#7f8c8d",
    // marginBottom: 2,
  },
  detailValue: {
    fontSize: 10,
    color: "#328EA3",
    fontWeight: 500,
  },
  table: {
    display: "table",
    width: "100%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#ecf0f1",
    borderRadius: 4,
    marginTop: 3,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ecf0f1",
    minHeight: 10,
    alignItems: "center",
  },
  tableHeader: {
    backgroundColor: "#328EA3",
  },
  tableCol: {
    // paddingVertical: 2,
    // paddingHorizontal: 2,
    justifyContent: "center",
  },
  tableCell: {
    fontSize: 8,
    color: "#34495e",
    textAlign: "left",
  },
  tableCellHeader: {
    color: "#ffffff",
    fontWeight: 700,
    fontSize: 8,
    textAlign: "center",
  },
  tableColParent: {
    backgroundColor: "#f1f5f8",
  },
  tableCellParent: {
    fontWeight: 600,
    fontSize: 8,
  },
  
  // Column width specifications
  colSrNo: { width: "15%", justifyContent : "center" , alignContent : "center" , alignItems : "center"},
  colChemicalName:{ width: "15%", justifyContent : "center" , alignContent : "center" , alignItems : "center"},
  colTank: { width: "15%", justifyContent : "center" , alignContent : "center" , alignItems : "center"},
  colRatio: { width: "15%", justifyContent : "center" , alignContent : "center" , alignItems : "center"},
  colRatioUnit: { width: "15%", justifyContent : "center" , alignContent : "center" , alignItems : "center"},
  colQuantity: { width: "15%", justifyContent : "center" , alignContent : "center" , alignItems : "center"},
  colActualWeight: { width: "15%", justifyContent : "center" , alignContent : "center" , alignItems : "center"},

  manualEntrySection: {
    marginTop: 5,
    marginBottom: 10,
    // borderTop: "1 solid #ecf0f1",
    paddingTop: 10,
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
        value={formatDate(details?.data.createdAt || "-")}
      />
    </View>
  </View>
);

const DetailItem = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>
      {label} : <Text style={{ color: "#328EA3" }}>{value}</Text>
    </Text>
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
    <View style={[styles.tableCol, styles.colSrNo]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>Sr no.</Text>
    </View>
    <View style={[styles.tableCol, styles.colChemicalName]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>
        Chemical Name
      </Text>
    </View>
    <View style={[styles.tableCol, styles.colTank]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>Tank</Text>
    </View>
    <View style={[styles.tableCol, styles.colRatio]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>Ratio</Text>
    </View>
    <View style={[styles.tableCol, styles.colRatioUnit]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>
        Ratio Unit
      </Text>
    </View>
    <View style={[styles.tableCol, styles.colQuantity]}>
      <Text style={[styles.tableCell, styles.tableCellHeader]}>Quantity</Text>
    </View>
    <View style={[styles.tableCol, styles.colActualWeight]}>
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
            <View style={[styles.tableCol, styles.colSrNo]}>
              <Text style={[styles.tableCell, styles.tableCellParent]}>
                {index + 1}
              </Text>
            </View>
            <View style={[styles.tableCol, styles.colChemicalName]}>
              <Text style={[styles.tableCell, styles.tableCellParent]}>
                {parent.templateId.name}
              </Text>
            </View>
            <View style={[styles.tableCol, styles.colTank]}>
              <Text style={[styles.tableCell, styles.tableCellParent]}>-</Text>
            </View>
            <View style={[styles.tableCol, styles.colRatio]}>
              <Text style={[styles.tableCell, styles.tableCellParent]}>-</Text>
            </View>
            <View style={[styles.tableCol, styles.colRatioUnit]}>
              <Text style={[styles.tableCell, styles.tableCellParent]}>-</Text>
            </View>
            <View style={[styles.tableCol, styles.colQuantity]}>
              <Text style={[styles.tableCell, styles.tableCellParent]}>-</Text>
            </View>
            <View style={[styles.tableCol, styles.colActualWeight]}>
              <Text style={[styles.tableCell, styles.tableCellParent]}>-</Text>
            </View>
          </View>

          {parent.childChemicals?.map((child, childIndex) => (
            <View style={styles.tableRow} key={`${index}-${childIndex}`}>
              <View style={[styles.tableCol, styles.colSrNo]}>
                <Text style={styles.tableCell}>
                  {index + 1}.{childIndex + 1}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.colChemicalName]}>
                <Text style={styles.tableCell}>
                  {child?.chemicalId.name || "-"}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.colTank]}>
                <Text style={styles.tableCell}>
                  {child?.chemicalId.tankId.name || "-"}
                </Text>
              </View>
              <View style={[styles.tableCol, styles.colRatio]}>
                <Text style={styles.tableCell}>{child.ratio || "-"}</Text>
              </View>
              <View style={[styles.tableCol, styles.colRatioUnit]}>
                <Text style={styles.tableCell}>{child?.ratioUnit || "-"}</Text>
              </View>
              <View style={[styles.tableCol, styles.colQuantity]}>
                <Text style={styles.tableCell}>{calculateQuantity(child)}</Text>
              </View>
              <View style={[styles.tableCol, styles.colActualWeight]}>
                <Text style={styles.tableCell}>-</Text>
              </View>
            </View>
          ))}
        </React.Fragment>
      ))}
    </>
  );
};

const ManualEntryFields = () => (
  <View style={styles.manualEntrySection}>
    <Text style={styles.sectionTitle}>Manual Entry</Text>
    <View style={styles.detailsGrid}>
      <DetailItem label="Date:" value=" " />{" "}
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