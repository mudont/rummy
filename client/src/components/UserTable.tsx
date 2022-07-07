import { Table } from "flowbite-react";

import { IUsersData } from "../types";
type Props = IUsersData;
const UserTable = (props: Props) => (
  <Table>
    <Table.Head>
      <Table.HeadCell>Id</Table.HeadCell>
      <Table.HeadCell>Username</Table.HeadCell>
      <Table.HeadCell>Email</Table.HeadCell>
    </Table.Head>
    <Table.Body className="divide-y">
      {props?.users.map(({ id, email, username }) => (
        <Table.Row
          key={id}
          className="bg-white dark:border-gray-700 dark:bg-gray-800"
        >
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
            {id}
          </Table.Cell>
          <Table.Cell>{username}</Table.Cell>
          <Table.Cell>{email}</Table.Cell>
        </Table.Row>
      ))}{" "}
    </Table.Body>
  </Table>
);
export default UserTable;
