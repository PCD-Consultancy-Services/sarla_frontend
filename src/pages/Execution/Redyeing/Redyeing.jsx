import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import headerURL from "../../headerURL";
import InputAdornment from "@mui/material/InputAdornment";
import {
  fetchSlipNumbers,
  fetchDispensingById,
  clearDispensingDetails,
} from "../../../redux/Slices/Execution/DispensingSlice";
import { textState } from "../../../redux/Slices/Theme/themeSetting";
import { useDebounce } from "../../../hooks/useDebounce";
import DispensingDetails from "../../../components/Dispensing/DispensingDetails";
import DispensingPDF from "../../../components/Dispensing/DispensingPDF";
import { PDFDownloadLink } from "@react-pdf/renderer";

export default function Redyeing() {
  const condition = useSelector((state) => state.theme.checkCondition);
  const sectionClass = condition.isOpen ? "page-padding" : "normal-padding";
  const [isFocused, setIsFocused] = useState(false);
  const [isSearchClicked, setisSearchClicked] = useState(false);

  const { slipNumbers, dispensingDetails, loading } = useSelector(
    (state) => state.dispensing
  );

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm();
  const [selectedSlip, setSelectedSlip] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const slipNumberWatch = watch("slipNumber");
  const debouncedSlipNumber = useDebounce(slipNumberWatch, 300);

  useEffect(() => {
    dispatch(
      textState({
        text: headerURL.redyeing.text,
        path: headerURL.redyeing.path,
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(clearDispensingDetails());
  }, []);


  useEffect(() => {
    const fetchInitialSlipNumbers = async () => {
      try {
        await dispatch(fetchSlipNumbers({}));
      } catch (error) {
        console.error("Failed to fetch initial slip numbers:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    if (!slipNumbers.length) {
      fetchInitialSlipNumbers();
    } else {
      setInitialLoading(false);
    }
  }, [dispatch, slipNumbers.length]);

  useEffect(() => {
    if (!initialLoading) {
      if (debouncedSlipNumber && debouncedSlipNumber.trim() !== "") {
        dispatch(fetchSlipNumbers({ q: debouncedSlipNumber }));
      } else {
        dispatch(fetchSlipNumbers({}));
      }
    }
  }, [debouncedSlipNumber, dispatch, initialLoading]);

  const onSearchSubmit = async () => {
    if (selectedSlip) {
      const response = await dispatch(fetchDispensingById(selectedSlip._id));
      if (response?.payload?.success) {
        setisSearchClicked(true);
      }
    } else {
      console.error("No slip number selected");
    }
  };

  // const calculateQuantity = (child) => {
  //   const ratio = child?.ratio;
  //   const literage = dispensingDetails?.data?.machineId?.literage;
  //   const batchWeight = dispensingDetails?.data?.batchWeight;
  //   const ratioUnit = child.ratioUnit;

  //   if (ratioUnit === "g/l") {
  //     return ratio * literage;
  //   } else if (ratioUnit === "%") {
  //     return batchWeight * ratio * 10;
  //   }
  //   return "-";
  // };

  const calculateQuantity = (child) => {
    const ratio = child?.ratio;
    const literage = dispensingDetails?.data?.machineId?.literage;
    const batchWeight = dispensingDetails?.data?.batchWeight;
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
    <section
      className={`sky-bg ${
        dispensingDetails ? "h-auto" : "vh-100"
      }  pb-5 addCustomerSection ${sectionClass}`}
    >
      <Box paddingTop={5}>
        <Grid
          container
          spacing={2}
          bgcolor="white"
          borderRadius="15px"
          padding="20px"
        >
          <Grid
            item
            xs={12}
            className="d-flex align-items-center justify-content-between"
          >
            <form
              onSubmit={handleSubmit(onSearchSubmit)}
              className="d-flex align-items-center"
            >
              <label className="formLabel">Slip Number :</label>
              <div className="search-inp ms-5">
                {initialLoading ? (
                  <CircularProgress />
                ) : (
                  <Controller
                    name="slipNumber"
                    control={control}
                    defaultValue=""
                    render={({ field }) => (
                      <Autocomplete
                        freeSolo
                        options={slipNumbers || []}
                        getOptionLabel={(option) => option.slipNumber || ""}
                        inputValue={field.value}
                        onInputChange={(event, newValue) => {
                          field.onChange(newValue);
                          if (!newValue.trim()) {
                            setisSearchClicked(false);
                          }
                        }}
                        onChange={(event, value) => {
                          setSelectedSlip(value);
                          field.onChange(value ? value.slipNumber : "");
                        }}
                        sx={{ width: 300 }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            error={!!errors.slipNumber}
                            helperText={errors.slipNumber?.message}
                            fullWidth
                            label="Search Slip Number"
                            variant="outlined"
                            onFocus={() => setIsFocused(true)}
                            onBlur={() => setIsFocused(false)}
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <Box
                                    sx={{
                                      marginRight:
                                        field.value || isFocused
                                          ? "0px"
                                          : "8px",
                                      transition: "margin-right 0.3s",
                                    }}
                                  >
                                    <SearchIcon
                                      color={isFocused ? "primary" : ""}
                                    />
                                  </Box>
                                </InputAdornment>
                              ),
                              endAdornment: (
                                <React.Fragment>
                                  {loading ? (
                                    <CircularProgress
                                      color="inherit"
                                      size={20}
                                    />
                                  ) : null}
                                  {params.InputProps.endAdornment}
                                </React.Fragment>
                              ),
                            }}
                            InputLabelProps={{
                              shrink: field.value || isFocused ? true : false,
                              style: {
                                marginLeft: field.value || isFocused ? 0 : 30,
                              },
                            }}
                          />
                        )}
                      />
                    )}
                  />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  className="px-4 ms-3"
                  disabled={!selectedSlip}
                >
                  Search
                </Button>
              </div>
            </form>
            <div>
              {isSearchClicked && dispensingDetails ? (
                <PDFDownloadLink
                  document={
                    <DispensingPDF
                      data={dispensingDetails}
                      userName={"SPFL VAPIPRD-DYE/FMT/09/V1.0"}
                    />
                  }
                  fileName="dispensing_details.pdf"
                >
                  {({ blob, url, loading, error }) =>
                    loading ? (
                      "Loading document..."
                    ) : (
                      <Button variant="contained" className="px-4 ms-2">
                        Export to PDF
                      </Button>
                    )
                  }
                </PDFDownloadLink>
              ) : (
                <Button
                  variant="contained"
                  className="px-4 ms-2"
                  disabled={!selectedSlip}
                >
                  Export
                </Button>
              )}
            </div>
          </Grid>

          {isSearchClicked ? (
            <Grid className="mt-3" padding="20px" container spacing={2}>
              <DispensingDetails details={dispensingDetails} />

              <TableContainer className="mt-5" component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell className="fw-bold">Sr No.</TableCell>
                      <TableCell className="fw-bold">Step</TableCell>
                      <TableCell className="fw-bold">Chemical Name</TableCell>
                      <TableCell className="fw-bold">Tank</TableCell>
                      <TableCell className="fw-bold">Ratio</TableCell>
                      <TableCell className="fw-bold">Ratio Unit</TableCell>
                      <TableCell className="fw-bold">Quantity</TableCell>
                      <TableCell className="fw-bold">Status</TableCell>
                      <TableCell className="fw-bold">Mode</TableCell>
                      <TableCell className="fw-bold">Actual Weights</TableCell>
                      <TableCell className="fw-bold">Set Weight</TableCell>
                      <TableCell className="fw-bold">Command</TableCell>
                      <TableCell className="fw-bold">Re-dispense</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {dispensingDetails?.data.recipeId.parentChemicals.map(
                      (parent, index) => (
                        <React.Fragment key={index}>
                          {/* Parent Chemical Row */}
                          <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                            <TableCell>{index + 1}</TableCell>
                            <TableCell>{/* Step Value for Parent */}</TableCell>
                            <TableCell>{parent.templateId.name}</TableCell>
                            <TableCell>{/* Tank Value for Parent */}</TableCell>
                            <TableCell>
                              {/* Empty for Parent Chemicals */}
                            </TableCell>
                            <TableCell>
                              {/* Empty for Parent Chemicals */}
                            </TableCell>
                            <TableCell>
                              {/* Quantity Value for Parent */}
                            </TableCell>
                            <TableCell>
                              {/* Status Value for Parent */}
                            </TableCell>
                            <TableCell>{/* Mode Value for Parent */}</TableCell>
                            <TableCell>
                              {/* Actual Weight for Parent */}
                            </TableCell>
                            <TableCell>{/* Set Weight for Parent */}</TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDispense(parent);
                                }}
                              >
                                Dispense
                              </Button>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleReDispense(parent);
                                }}
                              >
                                Re-dispense
                              </Button>
                            </TableCell>
                          </TableRow>
                          {/* Child Chemicals Row */}
                          {parent.childChemicals?.map((child, childIndex) => (
                            <TableRow key={`${index}-${childIndex}`}>
                              <TableCell>{`${index + 1}.${
                                childIndex + 1
                              }`}</TableCell>
                              <TableCell>
                                {/* Step Value for Child */}
                              </TableCell>
                              <TableCell>
                                {child?.chemicalId.name || "-"}
                              </TableCell>
                              <TableCell>
                              {child?.chemicalId.tankId.name || "-"}
                                {/* Tank Value for Child */ }
                              </TableCell>
                              <TableCell>{child.ratio || "-"}</TableCell>
                              <TableCell>{child?.ratioUnit || "-"}</TableCell>
                              <TableCell>{calculateQuantity(child)}</TableCell>
                              <TableCell>{/* Status for Child */}</TableCell>
                              <TableCell>{/* Mode for Child */}</TableCell>
                              <TableCell>
                                {/* Actual Weight for Child */}
                              </TableCell>
                              <TableCell>
                                {/* Set Weight for Child */}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDispense(child);
                                  }}
                                >
                                  Dispense
                                </Button>
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="contained"
                                  color="secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleReDispense(child);
                                  }}
                                >
                                  Re-dispense
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </React.Fragment>
                      )
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          ) : (
            <Box
              component="section"
              className="w-100 d-flex justify-content-center mt-5 p-3 rounded border"
            >
              <Typography className="text-danger">
                Please Select and Search the Slip number to view the data
              </Typography>
            </Box>
          )}
        </Grid>
      </Box>
    </section>
  );
}
