import React, { useState } from 'react';
import { Table, Spin } from 'antd';
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Collection } from "../../data/types";
import { ColumnsType } from 'antd/es/table';

export const CollectionsLeaderboard = () => {
  const { data: collections, isLoading: isLoadingCollections } = useQuery<Collection[]>({
    queryKey: ["collections"],
  });

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const columns: ColumnsType<Collection> = [
    {
      title: 'Pos.',
      dataIndex: 'id',
      key: 'id',
      render: (text, record, index) => ((currentPage - 1) * pageSize) + index + 1,
    },
    {
      title: 'Collection',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <>
          <img
            src={record.image}
            alt={record.name}
            className="w-5 h-5 rounded-full"
          />
          {record.name}
        </>
      ),
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      // Assuming you have an amount field in your Collection type.
      // If not, you might need to calculate the amount or fetch it from elsewhere.
    },
  ];

  const handleTableChange = (pagination: any) => {
    setCurrentPage(pagination.current);
    setPageSize(pagination.pageSize);
  };

  return (
    <div className="flex flex-col items-between justify-center gap-4  py-5 mb-40 rounded-lg px-4">
      <h2 className="text-2xl font-semibold text-start my-2 mb-4">
        Top Collections:
      </h2>
      {isLoadingCollections ? (
        <Spin />
      ) : (
        <Table
          columns={columns}
          dataSource={collections}
          rowKey="id"
          onChange={handleTableChange}
          pagination={{ pageSize: pageSize, defaultCurrent: currentPage }}
        />
      )}
    </div>
  );
};
