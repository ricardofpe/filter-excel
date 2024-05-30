import React, { useState, ChangeEvent, useEffect } from "react";
import * as XLSX from "xlsx";
import { ArrowDown } from "react-bootstrap-icons";
import { FaDownload } from "react-icons/fa";
import {
  ContainerData,
  InputFile,
  InputSearch,
  ButtonDownload,
  FilterSection,
  AutoFilterButtons,
  ButtonRemove,
} from "./TableExcelStyled";
import { FaDeleteLeft } from "react-icons/fa6";

interface Row {
  [key: string]: string | number;
}

const LOCAL_STORAGE_KEY = "tableExcelData";

const TableExcel: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [originalData, setOriginalData] = useState<Row[]>([]);
  const [filteredData, setFilteredData] = useState<Row[]>([]);
  const [showSearch, setShowSearch] = useState<boolean>(false);
  const [filterValues, setFilterValues] = useState<{ [key: string]: string[] }>(
    {}
  );
  const [appliedFilters, setAppliedFilters] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      const parsedData = JSON.parse(savedData) as Row[];
      setOriginalData(parsedData);
      setFilteredData(parsedData);
      setShowSearch(true);
    }
  }, []);

  useEffect(() => {
    if (originalData.length > 0) {
      const values: { [key: string]: string[] } = {};
      Object.keys(originalData[0] || {}).forEach((key) => {
        values[key] = Array.from(
          new Set(originalData.map((row) => row[key].toString()))
        );
      });
      setFilterValues(values);
    }
  }, [originalData]);

  useEffect(() => {
    let filteredData = originalData;
    Object.entries(appliedFilters).forEach(([columnName, value]) => {
      if (value !== "") {
        filteredData = filteredData.filter(
          (row) => row[columnName].toString() === value
        );
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
      setFilteredData(parsedData);
      setShowSearch(true);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedData));
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
        (val) =>
          typeof val === "string" &&
          val.toLowerCase().includes(value.toLowerCase())
      )
    );
    setFilteredData(filteredData);
  };

  const handleDownload = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");
    XLSX.writeFile(workbook, "filtered_data.xlsx");
  };

  const handleAutoFilter = (condition: string) => {
    let filteredData = originalData;

    const analyzeColumn = (columnName: string) => {
      const columnValues = originalData.map((row) => row[columnName]);
      const numericValues = columnValues.filter(
        (value) => typeof value === "number"
      ) as number[];
      const stringValues = columnValues.filter(
        (value) => typeof value === "string"
      ) as string[];

      if (numericValues.length > 0) {
        const mean =
          numericValues.reduce((acc, val) => acc + val, 0) /
          numericValues.length;
        const stdDev = Math.sqrt(
          numericValues.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) /
            numericValues.length
        );
        return {
          outliers: (value: number) => Math.abs(value - mean) > 2 * stdDev,
          lessThanMean: (value: number) => value < mean,
        };
      } else if (stringValues.length > 0) {
        const freqMap: { [key: string]: number } = {};
        stringValues.forEach((value) => {
          if (!freqMap[value]) freqMap[value] = 0;
          freqMap[value]++;
        });
        const mostFrequent = Object.keys(freqMap).reduce((a, b) =>
          freqMap[a] > freqMap[b] ? a : b
        );
        return {
          containsMostFrequent: (value: string) => value.includes(mostFrequent),
          isNull: (value: string) => value === "",
        };
      }
    };

    Object.keys(originalData[0]).forEach((columnName) => {
      const filters = analyzeColumn(columnName);
      switch (condition) {
        case "outliers":
          if (filters?.outliers) {
            filteredData = filteredData.filter((row) => {
              const value = Number(row[columnName]);
              return filters.outliers(value);
            });
          }
          break;
        case "lessThanMean":
          if (filters?.lessThanMean) {
            filteredData = filteredData.filter((row) => {
              const value = Number(row[columnName]);
              return filters.lessThanMean(value);
            });
          }
          break;
        case "containsMostFrequent":
          if (filters?.containsMostFrequent) {
            filteredData = filteredData.filter((row) => {
              const value = row[columnName].toString();
              return filters.containsMostFrequent(value);
            });
          }
          break;
        case "isNull":
          if (filters?.isNull) {
            filteredData = filteredData.filter((row) => {
              const value = row[columnName].toString();
              return filters.isNull(value);
            });
          }
          break;
        default:
          break;
      }
    });

    setFilteredData(filteredData);
  };

  const handleRemoveData = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setOriginalData([]);
    setFilteredData([]);
    setShowSearch(false);
  };

  return (
    <>
      <span>
        Upload your file below <ArrowDown size={15} />
      </span>
      <InputFile type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
      {showSearch && (
        <>
          <InputSearch
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
          <FilterSection>
            {Object.entries(filterValues).map(([columnName, values]) => (
              <div key={columnName}>
                <label htmlFor={columnName}>{columnName}</label>
                <select
                  id={columnName}
                  value={appliedFilters[columnName]}
                  onChange={(e) => handleFilter(columnName, e.target.value)}
                >
                  <option value="">All</option>
                  {values.map((value) => (
                    <option key={value} value={value}>
                      {value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </FilterSection>
          <AutoFilterButtons>
            <button onClick={() => handleAutoFilter("outliers")}>
              Filter Outliers
            </button>
            <button onClick={() => handleAutoFilter("lessThanMean")}>
              Values Less Than Mean
            </button>
            <button onClick={() => handleAutoFilter("containsMostFrequent")}>
              Contains Most Frequent Value
            </button>
            <button onClick={() => handleAutoFilter("isNull")}>
              Null/Empty Values
            </button>
          </AutoFilterButtons>
          <ButtonDownload onClick={handleDownload}>
            <FaDownload />
            Download Filtered Data
          </ButtonDownload>
          <ButtonRemove onClick={handleRemoveData}>
            <FaDeleteLeft /> Remove Sheet
          </ButtonRemove>
        </>
      )}
      <ContainerData>
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