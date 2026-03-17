import React, { useState, useEffect, useRef } from "react"

const InfiniteScrollList = () => {
  const [items, setItems] = useState([]) // 列表数据
  const [page, setPage] = useState(1) // 当前页码
  const [loading, setLoading] = useState(false) // 加载状态
  const [hasMore, setHasMore] = useState(true) // 是否还有更多数据

  const loaderRef = useRef(null) // 哨兵元素的引用

  // 模拟 API 请求
  const fetchMoreData = async (pageNum) => {
    if (loading || !hasMore) return

    setLoading(true)
    // 模拟网络延迟
    setTimeout(() => {
      const newItems = Array.from(
        { length: 15 },
        (_, i) => `Item ${(pageNum - 1) * 15 + i + 1}`,
      )

      // 如果超过 50 条数据，模拟加载完毕
      if (items.length + newItems.length >= 50) {
        setHasMore(false)
      }

      setItems((prev) => [...prev, ...newItems])
      setLoading(false)
    }, 800)
  }

  // 监听哨兵元素是否进入视口
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // entries[0] 是我们观察的 loaderRef 元素
        if (entries[0].isIntersecting && hasMore && !loading) {
          setPage((prevPage) => prevPage + 1)
        }
      },
      { threshold: 1.0 },
    ) // threshold: 1.0 表示元素完全进入视口才触发

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current)
    }
  }, [hasMore, loading]) // 依赖项确保状态最新

  // 当页码改变时请求数据
  useEffect(() => {
    fetchMoreData(page)
  }, [page])

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "20px auto",
        border: "1px solid #eee",
      }}
    >
      <h3 style={{ textAlign: "center" }}>无限滚动列表</h3>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {items.map((item, index) => (
          <li
            key={index}
            style={{ padding: "20px", borderBottom: "1px solid #f0f0f0" }}
          >
            {item}
          </li>
        ))}
      </ul>

      {/* 底部哨兵元素 */}
      <div
        ref={loaderRef}
        style={{ padding: "20px", textAlign: "center", color: "#999" }}
      >
        {loading
          ? "⏳ 加载中..."
          : hasMore
            ? "向上滚动加载更多"
            : "没有更多数据了"}
      </div>
    </div>
  )
}

export default InfiniteScrollList
