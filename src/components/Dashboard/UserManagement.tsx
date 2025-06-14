import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  Users,
  Coins,
  Delete,
  Trash2,
} from "lucide-react";
import { User } from "../../types";
import { useTranslation } from "../../i18n/useTranslation";

// <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
//     <table className="min-w-full table-auto">
//       <thead>
//         <tr className="bg-gray-100 dark:bg-gray-800">
//           <th className="px-4 py-3 text-left">USER</th>
//           <th className="px-4 py-3 text-left">ROLE</th>
//           <th className="px-4 py-3 text-left">BALANCE</th>
//           <th className="px-4 py-3 text-left">STATUS</th>
//           <th className="px-4 py-3 text-left">REGISTERED</th>
//           <th className="px-4 py-3 text-left">ACTIONS</th>
//         </tr>
//       </thead>
//       <tbody>
//         {Array.from({ length: 8 }).map((_, index) => (
//           <tr key={index} className="animate-pulse border-t">
//             {/* USER */}
//             <td className="px-4 py-4">
//               <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
//               <div className="h-3 bg-gray-300 rounded w-24"></div>
//             </td>

//             {/* ROLE */}
//             <td className="px-4 py-4">
//               <div className="h-5 bg-gray-300 rounded w-16"></div>
//             </td>

//             {/* BALANCE */}
//             <td className="px-4 py-4">
//               <div className="h-4 bg-gray-300 rounded w-12"></div>
//             </td>

//             {/* STATUS */}
//             <td className="px-4 py-4">
//               <div className="h-4 bg-gray-300 rounded w-16"></div>
//             </td>

//             {/* REGISTERED */}
//             <td className="px-4 py-4">
//               <div className="h-4 bg-gray-300 rounded w-20"></div>
//             </td>

//             {/* ACTIONS */}
//             <td className="px-4 py-4 flex space-x-3">
//               <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
//               <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
//               <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
//             </td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   </div>

type UserManagementProps = {
  onUserClick: (id: string) => void;
};

export const UserManagement: React.FC<UserManagementProps> = ({
  onUserClick,
}) => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true); // <-- loading state qo'shildi
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPlan, setFilterPlan] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // fetch boshlanishida loading true
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://mlm-backend.pixl.uz/users", {
          headers: {
            accept: "*/*",
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch users");
        const data = await res.json();
        setUsers(data);
      } catch (err) {
        setUsers([]);
      } finally {
        setLoading(false); // fetch tugagach loading false
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.email
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesPlan =
      filterPlan === "all" || user.subscriptionPlan === filterPlan;
    // Status filter should use isActive for "Active"/"Inactive"
    let matchesStatus = true;
    if (filterStatus === "Active") matchesStatus = user.isActive === true;
    else if (filterStatus === "Inactive")
      matchesStatus = user.isActive === false;
    else if (filterStatus === "Suspended")
      matchesStatus = user.status === "Suspended";
    return matchesSearch && matchesPlan && matchesStatus;
  });

  // const getStatusColor = (status: string) => {
  //   switch (status) {
  //     case "Active":
  //       return "bg-green-100 text-green-800";
  //     case "Inactive":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "Suspended":
  //       return "bg-red-100 text-red-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case "Basic":
        return "bg-blue-100 text-blue-800";
      case "Premium":
        return "bg-purple-100 text-purple-800";
      case "Enterprise":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(
      users.map((user) =>
        user.id === userId
          ? {
              ...user,
              status:
                user.status === "Active"
                  ? "Suspended"
                  : ("Active" as "Active" | "Inactive" | "Suspended"),
            }
          : user
      )
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          {t("userManagementTitle")}
        </h2>
        <p className="text-gray-600">{t("userManagementDesc")}</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder={t("searchByPhone")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Plan Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={filterPlan}
              onChange={(e) => setFilterPlan(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t("allPlans")}</option>
              <option value="Basic">{t("basic")}</option>
              <option value="Premium">{t("premium")}</option>
              <option value="Enterprise">{t("enterprise")}</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">{t("allStatus")}</option>
              <option value="Active">{t("active")}</option>
              <option value="Inactive">{t("inactive")}</option>
              <option value="Suspended">{t("suspended")}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            // Skeleton loader
            <div className="overflow-x-auto rounded-lg shadow border border-gray-200">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      USER
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      ROLE
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      BALANCE
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      STATUS
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      REGISTERED
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <tr key={index} className="animate-pulse border-t">
                      {/* USER */}
                      <td className="px-4 py-4">
                        <div className="h-4 bg-gray-300 rounded w-48 mb-2"></div>
                        <div className="h-3 bg-gray-300 rounded w-24"></div>
                      </td>
                      {/* ROLE */}
                      <td className="px-4 py-4">
                        <div className="h-5 bg-gray-300 rounded w-16"></div>
                      </td>
                      {/* BALANCE */}
                      <td className="px-4 py-4">
                        <div className="h-4 bg-gray-300 rounded w-12"></div>
                      </td>
                      {/* STATUS */}
                      <td className="px-4 py-4">
                        <div className="h-4 bg-gray-300 rounded w-16"></div>
                      </td>
                      {/* REGISTERED */}
                      <td className="px-4 py-4">
                        <div className="h-4 bg-gray-300 rounded w-20"></div>
                      </td>
                      {/* ACTIONS */}
                      <td className="px-4 py-4 flex space-x-3">
                        <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                        <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                        <div className="h-5 w-5 bg-gray-300 rounded-full"></div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("user")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("Role")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("balance")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("status")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("registered")}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t("actions")}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {user.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPlanColor(
                          user.id
                        )}`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1 items-center text-sm font-medium text-gray-900">
                        <Coins className="text-yellow-400 w-5" />{" "}
                        <span>{user.coin}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.isActive
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {user.isActive ? t("active") : t("inactive")}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onUserClick(user.id)}
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {/* Delete button */}
                        <button
                          onClick={async () => {
                            const token = localStorage.getItem("token");
                            try {
                              await fetch(
                                `https://mlm-backend.pixl.uz/users/${user.id}`,
                                {
                                  method: "DELETE",
                                  headers: {
                                    accept: "*/*",
                                    "Content-Type": "application/json",
                                    ...(token
                                      ? { Authorization: `Bearer ${token}` }
                                      : {}),
                                  },
                                }
                              );
                              // Remove user from state
                              setUsers((prev) =>
                                prev.filter((u) => u.id !== user.id)
                              );
                            } catch (e) {
                              // Optionally show error
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-1 hover:bg-red-50 rounded transition-colors"
                          title={t("delete")}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            const token = localStorage.getItem("token");
                            try {
                              const url = user.isActive
                                ? `https://mlm-backend.pixl.uz/users/block/${user.id}`
                                : `https://mlm-backend.pixl.uz/users/deblock/${user.id}`;
                              await fetch(url, {
                                method: "GET",
                                headers: {
                                  accept: "*/*",
                                  "Content-Type": "application/json",
                                  ...(token
                                    ? { Authorization: `Bearer ${token}` }
                                    : {}),
                                },
                              });
                              setUsers((prev) =>
                                prev.map((u) =>
                                  u.id === user.id
                                    ? { ...u, isActive: !user.isActive }
                                    : u
                                )
                              );
                            } catch (e) {
                              // Optionally show error
                            }
                          }}
                          className={`p-1 rounded transition-colors ${
                            user.isActive
                              ? "text-red-600 hover:text-red-900 hover:bg-red-50"
                              : "text-green-600 hover:text-green-900 hover:bg-green-50"
                          }`}
                        >
                          {user.isActive ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center">
            <Users className="w-8 h-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-900">
                {t("totalUsers")}
              </p>
              <p className="text-2xl font-bold text-blue-600">{users.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-green-900">
                {t("activeUsers")}
              </p>
              <p className="text-2xl font-bold text-green-600">
                {users.filter((u) => u.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">$</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-900">
                {t("totalBalance")}
              </p>
              <p className="text-2xl font-bold text-purple-600">
                $
                {users
                  .reduce((sum, user) => sum + user.accountBalance, 0)
                  .toFixed(2)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">E</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-900">
                {t("enterpriseUsers")}
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {
                  users.filter((u) => u.subscriptionPlan === "Enterprise")
                    .length
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
