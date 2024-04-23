import React, { useState, ChangeEvent, useEffect } from "react";
import * as XLSX from "xlsx";
import { ArrowDown } from "react-bootstrap-icons";
import { ContainerData, InputFile, InputSearch } from "./TableExcelStyled";

interface Row {
  [key: string]: string | number;
}

const TableExcel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [originalData, setOriginalData] = useState<Row[]>([]);
  const [filteredData, setFilteredData] = useState<Row[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [filterValues, setFilterValues] = useState<{ [key: string]: string[] }>({});
  const [appliedFilters, setAppliedFilters] = useState<{ [key: string]: string }>({});

  useEffect(() => {
   
    const values: { [key: string]: Set<string> } = {};
    Object.keys(originalData[0] || {}).forEach((key) => {
      values[key] = new Set(originalData.map((row) => row[key].toString()));
    });
    setFilterValues(values);
  }, [originalData]);

  useEffect(() => {

    let filteredData = originalData;
    Object.entries(appliedFilters).forEach(([columnName, value]) => {
      if (value !== "") {
        filteredData = filteredData.filter((row) => row[columnName].toString() === value);
      }
    });
    setFilteredData(filteredData);
  }, [originalData, appliedFilters]);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const reader = new FileReader();
    reader.readAsBinaryString(e.target.files[0]);
    reader.onload = (e) => {
      if (!e.target?.result) return;
      const data = e.target.result.toString();
      const workbook = XLSX.read(data, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const parsedData = XLSX.utils.sheet_to_json(sheet) as Row[];
      setOriginalData(parsedData);
      setShowSearch(true);
    };
  };

  const handleFilter = (columnName: string, value: string) => {
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      [columnName]: value,
    }));
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const filteredData = originalData.filter((row) =>
      Object.values(row).some(
        (value) =>
          typeof value === "string" &&
          value.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filteredData);
  };

  const handleClearFilter = (columnName: string) => {
    setAppliedFilters((prevFilters) => ({
      ...prevFilters,
      [columnName]: "",
    }));
  };

  return (
    <>
      <span>
        Coloque seu arquivo abaixo <ArrowDown size={15} />
      </span>
      <InputFile
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileUpload}
      />
      {showSearch && (
        <>
          <InputSearch
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <div>
            {Object.entries(filterValues).map(([columnName, values]) => (
              <div key={columnName}>
                <label htmlFor={columnName}>{columnName}</label>
                <select
                  id={columnName}
                  value={appliedFilters[columnName]}
                  onChange={(e) => handleFilter(columnName, e.target.value)}
                >
                  <option value="">All</option>
                  {[...values].map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
               
              </div>
            ))}
          </div>
        </>
      )}
      <ContainerData
        style={{ display: "grid", gridTemplateColumns: `repeat(auto-fill, minmax(100px))` }}
      >
        {filteredData.length > 0 && (
          <table className="table">
            <thead>
              <tr>
                {Object.keys(filteredData[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, index) => (
                <tr key={index}>
                  {Object.values(row).map((value, index) => (
                    <td key={index}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </ContainerData>
    </>
  );
};

export default TableExcel;
