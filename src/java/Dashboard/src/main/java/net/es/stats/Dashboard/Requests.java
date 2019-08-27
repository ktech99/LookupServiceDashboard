package net.es.stats.Dashboard;

import ch.qos.logback.core.util.SystemInfo;
import org.apache.http.HttpHost;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.index.IndexResponse;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.action.search.SearchScrollRequest;
import org.elasticsearch.client.RestClient;

import org.elasticsearch.client.RequestOptions;

import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.xcontent.XContentType;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.MatchQueryBuilder;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.elasticsearch.search.fetch.subphase.FetchSourceContext;
import org.springframework.data.convert.ReadingConverter;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.*;

import static org.elasticsearch.index.query.QueryBuilders.matchQuery;
import static org.elasticsearch.index.query.QueryBuilders.termQuery;

@RestController
public class Requests {

  @GetMapping("/groupCommunities")
  public Set<String> getGroupCommunities() throws IOException {
    RestHighLevelClient client = initClient();

    SearchResponse searchResponse = searchResponse(client);
    SearchHit[] searchHits = searchResponse.getHits().getHits();
    Set<String> communities = new TreeSet<String>();
    for (SearchHit hit : searchHits) {
      String community = "";
      try {
        community = (hit.getSourceAsMap()).get("group-communities").toString();

      } catch (Exception e) {
        // todo
      }
      community = community.replace("[", "").replace("]", "");
      String[] communityArr = community.split(",");
      for (String s : communityArr) {
        if (!s.trim().equals("")) {
          communities.add(s.trim());
        }
      }
    }
    client.close();
    return communities;
  }

  @GetMapping("/pSchedulerTests")
  public Set<String> getPSchedulerTests() throws IOException {
    RestHighLevelClient client = initClient();
    SearchResponse searchResponse = searchResponse(client);
    SearchHit[] searchHits = searchResponse.getHits().getHits();
    Set<String> schedulers = new TreeSet<String>();
    for (SearchHit hit : searchHits) {
      String scheduler = "";
      try {
        scheduler = (hit.getSourceAsMap()).get("pscheduler-tests").toString();
      } catch (Exception e) {
        // todo
      }
      scheduler = scheduler.replace("[", "").replace("]", "");
      String[] schedulerArr = scheduler.split(",");
      for (String s : schedulerArr) {
        if (!s.trim().equals("")) {
          schedulers.add(s.trim());
        }
      }
    }
    client.close();
    return schedulers;
  }

  @GetMapping("/getAllKeys")
  public Set<Object> getKeys() throws IOException {
    RestHighLevelClient client = initClient();
    SearchResponse searchResponse = searchResponse(client);
    SearchHit[] searchHits = searchResponse.getHits().getHits();
    Set<Object> keys = new TreeSet<>();
    for (SearchHit hit : searchHits) {
      keys.addAll(hit.getSourceAsMap().keySet());
    }
    return keys;
  }

  @GetMapping("/search")
  public Set<Map<String, String>> searchHosts(
      @RequestParam String key,
      @RequestParam String groupCommunity,
      @RequestParam String pSchedulers,
      @RequestParam String searchTerm,
      @RequestParam int limit)
      throws IOException {
    RestHighLevelClient client = initClient();
    SearchResponse searchResponse =
        searchHostResponse(client, key, groupCommunity, pSchedulers.split(","), searchTerm, limit);
    SearchHit[] searchHits = searchResponse.getHits().getHits();

    Set<Map<String,String>> setMap = new HashSet<>();

    for (SearchHit hit : searchHits) {
      Map<String, Object> sourceMap = hit.getSourceAsMap();
      System.out.println(sourceMap);
      String hostName =
          sourceMap
              .get("host-name")
              .toString()
              .replace(", ", "\n")
              .replace("[", "")
              .replace("]", "");

      //todo hardware
      StringBuilder systemInfo = new StringBuilder();
      String osName = sourceMap.get("host-os-name").toString().replace("[", "").replace("]", "");
      String osKernel =
          sourceMap.get("host-os-kernel").toString().replace("[", "").replace("]", "");
      systemInfo.append("Operating System: ");
      systemInfo.append(osName);
      systemInfo.append("\n");
      systemInfo.append("Kernal: ");
      systemInfo.append(osKernel);
      //todo contact

      String toolkitVersion =
          sourceMap.get("pshost-toolkitversion").toString().replace("[", "").replace("]", "");

      String communities = sourceMap
              .get("group-communities")
              .toString()
//              .replace(", ", "\n")
              .replace("[", "")
              .replace("]", "");

      Map<String, String> hostMap = new TreeMap<>();
      hostMap.put("Host Name", hostName);
      hostMap.put("System Info", systemInfo.toString());
      hostMap.put("Toolkit Version", toolkitVersion);
      hostMap.put("Communities", communities);
      setMap.add(hostMap);
    }
    return setMap;
  }

  private SearchResponse searchResponse(RestHighLevelClient client) throws IOException {
    SearchRequest searchRequest = new SearchRequest("lookup");
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
    searchSourceBuilder.query(QueryBuilders.matchAllQuery());
    searchSourceBuilder.from(0);
    searchSourceBuilder.size(10000);

    searchRequest.source(searchSourceBuilder);
    return client.search(searchRequest, RequestOptions.DEFAULT);
  }

  private SearchResponse searchTermResponse(RestHighLevelClient client, String term)
      throws IOException {
    SearchRequest searchRequest = new SearchRequest("lookup");
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
    searchSourceBuilder.size(10000);
    searchSourceBuilder.query(termQuery("group-communities.keyword", term));
    searchRequest.source(searchSourceBuilder);
    return client.search(searchRequest, RequestOptions.DEFAULT);
  }

  private SearchResponse searchHostResponse(
      RestHighLevelClient client,
      String key,
      String groupCommunity,
      String[] pSchedulers,
      String searchTerm,
      int limit)
      throws IOException {
    BoolQueryBuilder query = QueryBuilders.boolQuery();
    SearchRequest searchRequest = new SearchRequest("lookup");
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

    if (key.length() > 0) {
      query.must(termQuery(key + ".keyword", searchTerm));
    }
    if (groupCommunity.length() > 0) {
      query.must(termQuery("group-communities.keyword", groupCommunity));
    }
    for (String pScheduler : pSchedulers) {
      if (pScheduler.length() > 0) {
        query.must(termQuery("pscheduler-tests.keyword", pScheduler));
      }
    }
    query.must(termQuery("type.keyword", "host"));
    searchSourceBuilder.query(query);
    searchRequest.source(searchSourceBuilder);
    return client.search(searchRequest, RequestOptions.DEFAULT);
  }

  private RestHighLevelClient initClient() {
    return new RestHighLevelClient(
        RestClient.builder(
            new HttpHost("localhost", 9200, "http"), new HttpHost("localhost", 9201, "http")));
  }
}
