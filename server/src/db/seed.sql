INSERT INTO menus (name, description, price, image_url, stock) VALUES
  ('아메리카노(ICE)', '깔끔하고 시원한 에스프레소와 물의 조화', 4000, '/images/americano-ice.jpg', 10),
  ('아메리카노(HOT)', '진한 에스프레소에 뜨거운 물을 더한 기본 커피', 4000, '/images/americano-hot.jpg', 10),
  ('카페라떼', '에스프레소와 부드러운 우유가 어우러진 라떼', 5000, '/images/caffe-latte.jpg', 10),
  ('바닐라라떼', '달콤한 바닐라 향을 더한 부드러운 라떼', 5500, NULL, 10),
  ('카푸치노', '풍성한 우유 거품이 올라간 고소한 커피', 5000, NULL, 10),
  ('콜드브루', '찬물로 오랜 시간 추출한 깊고 부드러운 맛', 4500, NULL, 10);

INSERT INTO options (name, price, menu_id)
SELECT option.name, option.price, menus.id
FROM menus
CROSS JOIN (VALUES ('샷 추가', 500, 1), ('시럽 추가', 0, 2)) AS option (name, price, sort_order)
ORDER BY menus.id, option.sort_order;
