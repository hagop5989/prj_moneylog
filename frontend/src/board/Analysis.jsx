import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Flex,
  Select,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
} from "@chakra-ui/react";
import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { LoginContext } from "../LoginProvider.jsx";
import { useNavigate } from "react-router-dom";
import { myToast } from "../App.jsx";
import axios from "axios";

function Analysis(props) {
  const [dbRows, setDbRows] = useState([]);
  const [postSuccess, setPostSuccess] = useState(false);
  const [showPieChart, setShowPieChart] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");

  const account = useContext(LoginContext);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    if (!account.isLoggedIn() && !localStorage.getItem("token")) {
      myToast(toast, "로그인 필요!!", "error");
      account.logout();
      navigate("/login");
    }
    axios
      .get("/api/board/list")
      .then((res) => {
        setDbRows(
          res.data.boardList.map((board) => ({
            ...board,
            income: Number(board.income),
            expense: Number(board.expense),
            date: new Date(board.date),
          })),
        );
      })
      .catch((e) => console.error("Error fetching board list:", e));
  }, [postSuccess, account.id]);

  const getTotalIncomeExpense = () => {
    const totalIncome = dbRows.reduce((sum, row) => sum + row.income, 0);
    const totalExpense = dbRows.reduce((sum, row) => sum + row.expense, 0);
    return { totalIncome, totalExpense };
  };

  const getMonthlyData = () => {
    const monthlyData = {};

    dbRows.forEach((row) => {
      const month = row.date.getMonth() + 1;
      const year = row.date.getFullYear();
      const key = `${year}-${String(month).padStart(2, "0")}`;

      if (!monthlyData[key]) {
        monthlyData[key] = { month: key, 수입: 0, 지출: 0, 합계: 0 };
      }

      monthlyData[key].수입 += row.income;
      monthlyData[key].지출 += row.expense;
      monthlyData[key].합계 += row.income - row.expense;
    });

    const currentYear = new Date().getFullYear();
    for (let month = 1; month <= 12; month++) {
      const key = `${currentYear}-${String(month).padStart(2, "0")}`;
      if (!monthlyData[key]) {
        monthlyData[key] = { month: key, 수입: 0, 지출: 0, 합계: 0 };
      }
    }

    return Object.values(monthlyData).sort(
      (a, b) => new Date(a.month) - new Date(b.month),
    );
  };

  const { totalIncome, totalExpense } = getTotalIncomeExpense();

  const pieData = [
    { name: "수입", value: totalIncome },
    { name: "지출", value: totalExpense },
  ];

  const COLORS = ["#0088FE", "#FF0000"];

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 20;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={COLORS[index % COLORS.length]}
        fontSize="16px"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handleMonthChange = (event) => {
    setSelectedMonth(event.target.value);
  };

  const filteredData = selectedMonth
    ? dbRows.filter((row) => {
        const month = row.date.getMonth() + 1;
        const year = row.date.getFullYear();
        const key = `${year}-${String(month).padStart(2, "0")}`;
        return key === selectedMonth;
      })
    : dbRows;

  const totalFilteredIncome = filteredData.reduce(
    (sum, row) => sum + row.income,
    0,
  );
  const totalFilteredExpense = filteredData.reduce(
    (sum, row) => sum + row.expense,
    0,
  );
  const totalFilteredSum = totalFilteredIncome - totalFilteredExpense;

  const monthlyData = getMonthlyData();
  const selectedMonthIndex = selectedMonth
    ? monthlyData.findIndex((data) => data.month === selectedMonth)
    : -1;
  const displayedMonthlyData =
    selectedMonthIndex !== -1
      ? monthlyData.slice(
          Math.max(0, selectedMonthIndex - 1),
          selectedMonthIndex + 2,
        )
      : monthlyData;

  return (
    <Box>
      <Button
        m={2}
        fontWeight={"medium"}
        colorScheme={"blue"}
        onClick={() => setShowPieChart(!showPieChart)}
      >
        도표 전환
      </Button>
      <Select
        placeholder="전체 보기"
        onChange={handleMonthChange}
        m={2}
        width="200px"
        value={selectedMonth}
      >
        {getMonthlyData().map((data) => (
          <option key={data.month} value={data.month}>
            {data.month}
          </option>
        ))}
      </Select>
      <Flex>
        <Box width="50%" bgColor={"gray.50"} borderRadius={"15px"}>
          {showPieChart ? (
            <ResponsiveContainer width="100%" height={400}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={120}
                  innerRadius={60} // 안을 비워 도넛 형태로 만듦
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  formatter={(value) => `${value.toLocaleString()}원`}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart
                data={displayedMonthlyData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                onClick={(e) => setSelectedMonth(e.activeLabel)}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="수입" fill="#8884d8" />
                <Bar dataKey="지출" fill="#82ca9d" />
                <Line
                  type="monotone"
                  dataKey="합계"
                  stroke="#ff7300"
                  strokeWidth={4}
                  dot={{ r: 6 }} // 선의 두께를 더 굵게 설정
                />
              </ComposedChart>
            </ResponsiveContainer>
          )}
          <Text fontSize="2xl" color="red" textAlign="center">
            {selectedMonth
              ? `${selectedMonth} 총합: ${totalFilteredSum.toLocaleString()}원`
              : `총합: ${(totalIncome - totalExpense).toLocaleString()}원`}
          </Text>
        </Box>
        <Box width="50%">
          <Table>
            <Thead>
              <Tr bgColor={"gray.50"}>
                <Th fontSize={"1rem"}>날짜</Th>
                <Th fontSize={"1rem"}>수입</Th>
                <Th fontSize={"1rem"}>지출</Th>
                <Th fontSize={"1rem"}>합계</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredData.map((row) => (
                <Tr key={row.id}>
                  <Td>{row.date.toISOString().split("T")[0]}</Td>
                  <Td>{row.income.toLocaleString()}</Td>
                  <Td>{row.expense.toLocaleString()}</Td>
                  <Td>{(row.income - row.expense).toLocaleString()}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </Flex>
    </Box>
  );
}

export default Analysis;
