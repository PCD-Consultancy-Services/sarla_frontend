import React, { Fragment } from "react";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Collapse,
  Box,
  Button,
  IconButton,
  Paper,
} from "@mui/material";

const RecipeTable = ({
  parentChemicals,
  handleAddChild,
  handleEditChildChemical,
  handleDeleteChildChemical,
  handleDeleteParentChemical,
  handleAddSubChild,
  mode, // 'add' or 'edit'
}) => {
 
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell className="fw-bold">sr no.</TableCell>
            <TableCell className="fw-bold">Parent Chemical Name</TableCell>
            <TableCell className="fw-bold hidden">Ratio</TableCell>
            <TableCell className="fw-bold hidden">Ratio Unit</TableCell>
            <TableCell className="fw-bold">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {parentChemicals?.map((parent, index) => (
            <Fragment key={parent._id}>
              <TableRow style={{ backgroundColor: "#f0f0f0" }}>
                <TableCell>
                  <IconButton size="small"></IconButton>
                </TableCell>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  {mode === "add" ? parent.name : parent.templateId.name}
                </TableCell>
                <TableCell>
                  {/* {mode === 'edit' ? parent.ratio : ''} */}
                </TableCell>
                <TableCell>
                  {/* {mode === 'edit' ? parent.ratioUnit : ''} */}
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddChild(mode === "add" ? index : parent);
                    }}
                  >
                    Add Child
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    className="ms-2"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteParentChemical(
                        mode === "add" ? index : parent
                      );
                    }}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell
                  style={{ paddingBottom: 0, paddingTop: 0 }}
                  colSpan={6}
                >
                  <Collapse in={true} timeout="auto" unmountOnExit>
                    <Box margin={1}>
                      <Table size="small">
                        <TableHead>
                          <TableRow>
                            <TableCell className="fw-bold">sr no.</TableCell>
                            <TableCell className="fw-bold">
                              Child Chemical Name
                            </TableCell>
                            <TableCell className="fw-bold">Ratio</TableCell>
                            <TableCell className="fw-bold">
                              Ratio Unit
                            </TableCell>
                            <TableCell className="fw-bold">Actions</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {parent.childChemicals?.map((child, childIndex) => (
                            <TableRow key={childIndex}>
                              <TableCell>
                                {index + 1}.{childIndex + 1}
                              </TableCell>
                              <TableCell>
                                {mode === "add"
                                  ? child.name
                                  : child?.chemicalId?.name}
                              </TableCell>
                              <TableCell>{child.ratio}</TableCell>
                              <TableCell>{child.ratioUnit}</TableCell>
                              <TableCell>
                                {mode === "add" ? (
                                  <>
                                    <Button
                                      variant="contained"
                                      color="primary"
                                      size="small"
                                      className="ms-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddSubChild(index, childIndex);
                                      }}
                                    >
                                      Add Sub-Child
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="info"
                                      size="small"
                                      className="ms-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditChildChemical(
                                          index,
                                          childIndex
                                        );
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      size="small"
                                      className="ms-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteChildChemical(
                                          index,
                                          childIndex
                                        );
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </>
                                ) : (
                                  <>
                                    <Button
                                      variant="contained"
                                      color="info"
                                      size="small"
                                      className="ms-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditChildChemical(parent, child);
                                      }}
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      variant="contained"
                                      color="error"
                                      size="small"
                                      className="ms-2"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteChildChemical(
                                          parent,
                                          child
                                        );
                                      }}
                                    >
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </Box>
                  </Collapse>
                </TableCell>
              </TableRow>
            </Fragment>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default RecipeTable;
