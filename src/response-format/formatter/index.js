const okData = (res, data) => {
  res.status(200);
  res.json({
    data,
  });
};

const okDataList = (res, data, metaInfo) => {
  const metaData = {
    total: data.length,
    ...metaInfo,
  };
  res.status(200);
  res.json({
    data,
    metaData,
  });
};

const okCreated = (res, data) => {
  res.status(201);
  res.json({
    data,
  });
};

module.exports = {
  okData,
  okDataList,
  okCreated,
};

