type IOptions = {
  page?: number | string;
  limit?: number | string;
  sortBy?: string;
  sortOrder?: string;
};

const paginationSortingHelper = (options: IOptions) => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy: string = options.sortBy || "createdAt";
  const sortOrder: string = options.sortOrder === "asc" ? "asc" : "desc";

  console.log({ page, limit, skip, sortBy, sortOrder });

  return { page, limit, skip, sortBy, sortOrder };
};

export default paginationSortingHelper;
