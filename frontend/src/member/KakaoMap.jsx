import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";

const KakaoMap = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src =
      "//dapi.kakao.com/v2/maps/sdk.js?appkey=c9b3b5ea56ef481752e865cdbbb0335c&libraries=services,clusterer,drawing&autoload=false";
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      kakao.maps.load(() => {
        var markers = [];

        var mapContainer = document.getElementById("map");
        var mapOption = {
          center: new kakao.maps.LatLng(37.566826, 126.9786567),
          level: 3,
        };

        var map = new kakao.maps.Map(mapContainer, mapOption);

        var ps = new kakao.maps.services.Places();
        var infowindow = new kakao.maps.InfoWindow({ zIndex: 1 });

        function searchPlaces() {
          var keyword = document.getElementById("keyword").value;

          if (!keyword.replace(/^\s+|\s+$/g, "")) {
            alert("키워드를 입력해주세요!");
            return false;
          }

          ps.keywordSearch(keyword, placesSearchCB);
        }

        function placesSearchCB(data, status, pagination) {
          if (status === kakao.maps.services.Status.OK) {
            displayPlaces(data);
            displayPagination(pagination);
          } else if (status === kakao.maps.services.Status.ZERO_RESULT) {
            alert("검색 결과가 존재하지 않습니다.");
            return;
          } else if (status === kakao.maps.services.Status.ERROR) {
            alert("검색 결과 중 오류가 발생했습니다.");
            return;
          }
        }

        function displayPlaces(places) {
          var listEl = document.getElementById("placesList");
          var fragment = document.createDocumentFragment();
          var bounds = new kakao.maps.LatLngBounds();
          var listStr = "";

          removeAllChildNods(listEl);
          removeMarker();

          for (var i = 0; i < places.length; i++) {
            var placePosition = new kakao.maps.LatLng(places[i].y, places[i].x);
            var marker = addMarker(placePosition, i);
            var itemEl = getListItem(i, places[i]);

            bounds.extend(placePosition);

            (function (marker, title) {
              kakao.maps.event.addListener(marker, "mouseover", function () {
                displayInfowindow(marker, title);
              });

              kakao.maps.event.addListener(marker, "mouseout", function () {
                infowindow.close();
              });

              itemEl.onmouseover = function () {
                displayInfowindow(marker, title);
              };

              itemEl.onmouseout = function () {
                infowindow.close();
              };
            })(marker, places[i].place_name);

            fragment.appendChild(itemEl);
          }

          listEl.appendChild(fragment);
          map.setBounds(bounds);
        }

        function getListItem(index, places) {
          var el = document.createElement("li");
          var itemStr =
            '<span class="markerbg marker_' +
            (index + 1) +
            '"></span>' +
            '<div class="info">' +
            "   <h5>" +
            places.place_name +
            "</h5>";

          if (places.road_address_name) {
            itemStr +=
              "    <span>" +
              places.road_address_name +
              "</span>" +
              '   <span class="jibun gray">' +
              places.address_name +
              "</span>";
          } else {
            itemStr += "    <span>" + places.address_name + "</span>";
          }

          itemStr +=
            '  <span class="tel">' + places.phone + "</span>" + "</div>";

          el.innerHTML = itemStr;
          el.className = "item";

          return el;
        }

        function addMarker(position, idx, title) {
          var imageSrc =
            "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
          var imageSize = new kakao.maps.Size(36, 37);
          var imgOptions = {
            spriteSize: new kakao.maps.Size(36, 691),
            spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
            offset: new kakao.maps.Point(13, 37),
          };
          var markerImage = new kakao.maps.MarkerImage(
            imageSrc,
            imageSize,
            imgOptions,
          );
          var marker = new kakao.maps.Marker({
            position: position,
            image: markerImage,
          });

          marker.setMap(map);
          markers.push(marker);

          return marker;
        }

        function removeMarker() {
          for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
          }
          markers = [];
        }

        function displayPagination(pagination) {
          var paginationEl = document.getElementById("pagination");
          var fragment = document.createDocumentFragment();
          var i;

          while (paginationEl.hasChildNodes()) {
            paginationEl.removeChild(paginationEl.lastChild);
          }

          for (i = 1; i <= pagination.last; i++) {
            var el = document.createElement("a");
            el.href = "#";
            el.innerHTML = i;

            if (i === pagination.current) {
              el.className = "on";
            } else {
              el.onclick = (function (i) {
                return function () {
                  pagination.gotoPage(i);
                };
              })(i);
            }

            fragment.appendChild(el);
          }
          paginationEl.appendChild(fragment);
        }

        function displayInfowindow(marker, title) {
          var content =
            '<div style="padding:5px;z-index:1;">' + title + "</div>";

          infowindow.setContent(content);
          infowindow.open(map, marker);
        }

        function removeAllChildNods(el) {
          while (el.hasChildNodes()) {
            el.removeChild(el.lastChild);
          }
        }

        document.getElementById("searchBtn").onclick = function () {
          searchPlaces();
        };
      });
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      <div
        id="menu_wrap"
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 2,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          padding: "10px",
          borderRadius: "8px",
          width: "300px",
        }}
      >
        <div className="option" style={{ marginBottom: "10px" }}>
          <Box>
            <div>
              <input
                type="text"
                id="keyword"
                size="15"
                placeholder="검색어를 입력하세요"
              />
              <button id="searchBtn" style={{ marginLeft: "5px" }}>
                검색
              </button>
            </div>
          </Box>
        </div>
        <ul id="placesList" style={{ listStyle: "none", padding: 0 }}></ul>
        <div id="pagination" style={{ marginTop: "10px" }}></div>
      </div>
      <div id="map" style={{ width: "100%", height: "600px" }}></div>
    </div>
  );
};

export default KakaoMap;
