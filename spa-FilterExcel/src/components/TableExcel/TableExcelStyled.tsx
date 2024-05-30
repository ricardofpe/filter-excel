import styled, { keyframes } from "styled-components";

const appear = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

export const ContainerData = styled.div`
  background-color: #f8f9fa;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  width: 90%;
  padding: 20px;
  border-radius: 8px;
  animation: ${appear} 0.5s ease forwards;

  thead {
    background-color: #007bff;
    color: white;
  }

  th,
  td {
    padding: 12px;
    text-align: left;
    border: 1px solid #ddd;
  }

  td {
    max-width: 250px;
    word-wrap: break-word;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }
`;

export const InputFile = styled.input`
  margin: 20px 0;
  padding: 12px;
  border: 2px dashed #ccc;
  border-radius: 8px;
  font-size: 16px;
  display: block;
  width: 100%;
  max-width: 400px;
`;

export const InputSearch = styled.input`
  margin: 20px 0;
  padding: 10px 14px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 14px;
  width: 100%;
  max-width: 300px;
  display: block;
`;

export const ButtonDownload = styled.button`
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  animation: ${appear} 0.5s ease forwards;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #003f7f;
  }

  &:focus {
    outline: none;
  }

  svg {
    margin-right: 8px;
  }
`;

export const FilterSection = styled.div`
  margin: 20px 0;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  animation: ${appear} 0.5s ease forwards;

  label {
    margin-right: 10px;
  }

  select {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 14px;
  }
`;

export const AutoFilterButtons = styled.div`
  margin: 20px 0;
  display: flex;
  gap: 10px;
  animation: ${appear} 0.5s ease forwards;

  button {
    padding: 12px 16px;
    border: none;
    border-radius: 4px;
    background-color: #28a745;
    color: white;
    cursor: pointer;
    font-size: 14px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #218838;
    }

    &:active {
      background-color: #1e7e34;
    }

    &:focus {
      outline: none;
    }
  }
`;

export const ButtonRemove = styled.button`
  background-color: #ff6b6b;
  color: #fff;
  border: none;
  padding: 12px 20px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 20px;
  animation: ${appear} 0.5s ease forwards;

  &:hover {
    background-color: #e74c3c;
  }

  &:active {
    background-color: #d84315;
  }

  &:focus {
    outline: none;
  }

  svg {
    margin-right: 8px;
  }
`;
