package net.es.stats.Dashboard;

import org.apache.http.HttpHost;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RestClient;

import org.elasticsearch.client.RequestOptions;

import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.index.query.BoolQueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.*;

import static org.elasticsearch.index.query.QueryBuilders.*;

@RestController
public class Requests {

  /**
   * Get list of group communities for initially loading the dropdown
   *
   * @return list of group communities available to choose from in alphabetical order
   * @throws IOException if error getting value from database
   */
  @GetMapping("/groupCommunities")
  public Set<String> getGroupCommunities() throws IOException {
    RestHighLevelClient client = initClient();

    SearchResponse searchResponse = searchResponse(client);
    SearchHit[] searchHits = searchResponse.getHits().getHits();
    Set<String> communities = new TreeSet<>();
    for (SearchHit hit : searchHits) {
      String community;
      community = tryGet(hit.getSourceAsMap(), "group-communities");
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

  /**
   * Get list of initial pscheduler tests to populate dropdown
   *
   * @return list of pScheduler Tests available to choose from in alphabetical order
   * @throws IOException if error getting value from database
   */
  @GetMapping("/pSchedulerTests")
  public Set<String> getPSchedulerTests() throws IOException {
    RestHighLevelClient client = initClient();
    SearchResponse searchResponse = searchResponse(client);
    SearchHit[] searchHits = searchResponse.getHits().getHits();
    Set<String> schedulers = new TreeSet<>();
    for (SearchHit hit : searchHits) {
      String scheduler;
      scheduler = tryGet(hit.getSourceAsMap(), "pscheduler-tests");
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

  /**
   * List of all available keys in the document to populate autofill search
   *
   * @return List of available keys in alphabetical order
   * @throws IOException if unable to search database
   */
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

  /**
   * List of host data to populate host table
   *
   * @param key key chosen by user
   * @param groupCommunity group community chosen by user
   * @param pSchedulers pschedulers chosen by user surrounded by [] and separated by ,
   * @param searchTerm term the user is trying to search for; Has to have particular key
   * @param limit Number of terms returned
   * @return list of values of all hosts that match the search criteria
   * @throws IOException if unable to search database
   */
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
        searchHostResponse(client, key, groupCommunity, searchTerm, limit);
    SearchHit[] searchHits = searchResponse.getHits().getHits();

    Set<Map<String, String>> setMap = new HashSet<>();

    for (SearchHit hit : searchHits) {
      Map<String, Object> sourceMap = hit.getSourceAsMap();
      String uri = tryGet(sourceMap, "uri");
      String interfaces = tryGet(sourceMap, "host-net-interface");
      String hostName = tryGet(sourceMap, "host-name");
      StringBuilder hardware = new StringBuilder();
      String processor = "\n"; // todo processor?
      String memory = tryGet(sourceMap, "host-hardware-memory");

      // Get interfaces of a given host
      SearchResponse interfaceSearchResponse =
          searchInterfaceResponse(client, pSchedulers.split(","), interfaces.split(","));
      SearchHit[] interfaceHits = interfaceSearchResponse.getHits().getHits();

      // next iteration on empty interface
      if (interfaceHits.length == 0) {
        continue;
      }

      int interfaceCount = 1;
      String interfaceHardware = "";
      String pschedulerTests = "";

      for (SearchHit interfaceHit : interfaceHits) {
        Map<String, Object> interfaceMap = interfaceHit.getSourceAsMap();
        interfaceHardware = "NIC #" + interfaceCount + " Speed: " + "\n";
        // Todo speed?
        interfaceHardware +=
            "NIC #" + interfaceCount + " MTU: " + interfaceMap.get("interface-mtu");
        pschedulerTests = tryGet(interfaceMap, "pscheduler-tests");
        interfaceCount++;
      }

      hardware.append(processor);
      hardware.append("Memory: ");
      hardware.append(memory);
      hardware.append(interfaceHardware);

      StringBuilder systemInfo = new StringBuilder();
      String osName = tryGet(sourceMap, "host-os-name");
      String osKernel = tryGet(sourceMap, "host-os-kernal");
      systemInfo.append("Operating System: ");
      systemInfo.append(osName);
      systemInfo.append("\n");
      systemInfo.append("Kernal: ");
      systemInfo.append(osKernel);
      // todo contact

      String toolkitVersion = tryGet(sourceMap, "pshost-toolkitversion");
      String communities = tryGet(sourceMap, "group-communities");
      String longitude = tryGet(sourceMap, "location-longitude");
      String latitude = tryGet(sourceMap, "location-latitude");

      Map<String, String> hostMap = new TreeMap<>();
      hostMap.put("Host Name", hostName);
      hostMap.put("Hardware", hardware.toString());
      hostMap.put("System Info", systemInfo.toString());
      hostMap.put("Toolkit Version", toolkitVersion);
      hostMap.put("Communities", communities);
      hostMap.put("pSchedulers", pschedulerTests);
      hostMap.put("URI", uri);
      hostMap.put("JSON", sourceMap.toString());
      hostMap.put("latitude", latitude);
      hostMap.put("longitude", longitude);
      setMap.add(hostMap);
    }
    client.close();
    return setMap;
  }

  /**
   * list of services under a particular host
   *
   * @param hosts host for which to find services - separated by , if multiple
   * @param type type of server to search for - "all" to get all type of servers
   * @return list of services with values used to populating the services table
   * @throws IOException if unable to connect to database
   */
  @GetMapping("/searchService")
  public Set<Map<String, String>> searchService(@RequestParam String hosts, @RequestParam String type) throws IOException {
    RestHighLevelClient client = initClient();
    String[] hostArray = hosts.split(",");

    Set<Map<String, String>> mapSet = new HashSet<>();

    for (String host : hostArray) {

      SearchResponse searchResponse = searchServiceResponse(client, host);
      SearchHit[] searchHits = searchResponse.getHits().getHits();
      for (SearchHit searchHit : searchHits) {
        Map<String, Object> searchMap = searchHit.getSourceAsMap();
        Map<String, String> serviceMap = new HashMap<>();
        String serviceType = tryGet(searchMap, "service-type");
        System.out.println(serviceType);
        if (type.equalsIgnoreCase("all") || type.equalsIgnoreCase(serviceType)) {
          String name = tryGet(searchMap, "service-name");
          String address = ""; // todo address
          String location = ""; // todo location
          String communities = tryGet(searchMap, "group-communities");
          String version = tryGet(searchMap, "service-version");
          String command = ""; // todo command

          serviceMap.put("name", name);
          serviceMap.put("address", address);
          serviceMap.put("location", location);
          serviceMap.put("communities", communities);
          serviceMap.put("version", version);
          serviceMap.put("command", command);
          serviceMap.put("type", serviceType);
          serviceMap.put("JSON", searchMap.toString());
          mapSet.add(serviceMap);
        }
      }
    }
    client.close();
    return mapSet;
  }

  /**
   * returns list of coordinates of all hosts
   *
   * @return list of coordinates of all hosts
   * @throws IOException if unable to connect to database
   */
  @GetMapping("/getCoordinates")
  public Set<Map<String, String>> getAllCoordinates() throws IOException {
    RestHighLevelClient client = initClient();

    Set<Map<String, String>> mapSet = new HashSet<>();

    SearchResponse searchResponse = getLocationResponse(client);
    SearchHit[] searchHits = searchResponse.getHits().getHits();
    for (SearchHit searchHit : searchHits) {
      Map<String, Object> searchMap = searchHit.getSourceAsMap();
      //      System.out.println(searchMap);
      String latitude = tryGet(searchMap, "location-latitude");
      String longitude = tryGet(searchMap, "location-longitude");
      String hostName = tryGet(searchMap, "host-name");
      String uri = tryGet(searchMap, "uri");
      Map<String, String> outputMap = new HashMap<>();
      outputMap.put("latitude", latitude);
      outputMap.put("longitude", longitude);
      outputMap.put("Host Name", hostName);
      outputMap.put("URI", uri);
      mapSet.add(outputMap);
    }
    client.close();
    return mapSet;
  }

  @GetMapping("/getTypeOfServiceHost")
  public Set<String> getTypesofServiceHost(@RequestParam String hosts) throws IOException {
    RestHighLevelClient client = initClient();

    Set<String> mapSet = new HashSet<>();
    for (String host : hosts.split(",")) {
//      System.out.println(host);
      SearchResponse searchResponse = searchServiceResponse(client, host);
      SearchHit[] searchHits = searchResponse.getHits().getHits();
      for (SearchHit searchHit : searchHits) {
        Map<String, Object> searchMap = searchHit.getSourceAsMap();
        String serviceType = tryGet(searchMap, "service-type");
        mapSet.add(serviceType);
      }
    }

    client.close();
    return mapSet;
  }

  private SearchResponse getHostServiceTypeResponse(RestHighLevelClient client, String host)
      throws IOException {
    SearchRequest searchRequest = new SearchRequest("lookup");
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
    BoolQueryBuilder query = QueryBuilders.boolQuery();
    query.must(termQuery("service-host.keyword", host));
    query.must(termQuery("type.keyword", "service"));
    //    String[] includeFields = new String[] {"service-type"};
    //    String[] excludeFields = new String[0];
    searchSourceBuilder.fetchSource();
    searchSourceBuilder.query(query);
    searchSourceBuilder.from(0);
    searchSourceBuilder.size(10000);
    searchRequest.source(searchSourceBuilder);
    return client.search(searchRequest, RequestOptions.DEFAULT);
  }

  private SearchResponse getLocationResponse(RestHighLevelClient client) throws IOException {
    SearchRequest searchRequest = new SearchRequest("lookup");
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
    BoolQueryBuilder query = QueryBuilders.boolQuery();
    query.must(termQuery("type.keyword", "host"));
    String[] includeFields =
        new String[] {"location-longitude", "location-latitude", "host-name", "uri"};
    String[] excludeFields = new String[0];
    searchSourceBuilder.fetchSource(includeFields, excludeFields);
    searchSourceBuilder.query(query);
    searchSourceBuilder.from(0);
    searchSourceBuilder.size(10000);
    searchRequest.source(searchSourceBuilder);
    return client.search(searchRequest, RequestOptions.DEFAULT);
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
      RestHighLevelClient client, String key, String groupCommunity, String searchTerm, int limit)
      throws IOException {
    BoolQueryBuilder query = QueryBuilders.boolQuery();
    SearchRequest searchRequest = new SearchRequest("lookup");
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();
    searchSourceBuilder.size(limit);
    if (key.length() > 0 && !key.equals(" ")) {
      query.must(regexpQuery(key + ".keyword", searchTerm + ".*"));
    }
    if (groupCommunity.length() > 0) {
      query.must(termQuery("group-communities.keyword", groupCommunity));
    }

    query.must(termQuery("type.keyword", "host"));
    searchSourceBuilder.query(query);
    searchRequest.source(searchSourceBuilder);
    return client.search(searchRequest, RequestOptions.DEFAULT);
  }

  private SearchResponse searchInterfaceResponse(
      RestHighLevelClient client, String[] pSchedulers, String[] interfaces) throws IOException {
    BoolQueryBuilder query = QueryBuilders.boolQuery();
    SearchRequest searchRequest = new SearchRequest("lookup");
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

    for (String pScheduler : pSchedulers) {
      if (pScheduler.length() > 0) {
        query.must(termQuery("pscheduler-tests.keyword", pScheduler));
      }
    }

    for (String interfaceURI : interfaces) {
      if (interfaceURI.length() > 0) {
        query.must(termQuery("uri.keyword", interfaceURI));
      }
    }

    query.must(termQuery("type.keyword", "interface"));
    searchSourceBuilder.query(query);
    searchRequest.source(searchSourceBuilder);
    return client.search(searchRequest, RequestOptions.DEFAULT);
  }

  private SearchResponse searchServiceResponse(RestHighLevelClient client, String host)
      throws IOException {
    BoolQueryBuilder query = QueryBuilders.boolQuery();
    SearchRequest searchRequest = new SearchRequest("lookup");
    SearchSourceBuilder searchSourceBuilder = new SearchSourceBuilder();

    query.must(termQuery("service-host.keyword", host));
    query.must(termQuery("type.keyword", "service"));
    searchSourceBuilder.query(query);
    searchRequest.source(searchSourceBuilder);
    return client.search(searchRequest, RequestOptions.DEFAULT);
  }

  private String tryGet(Map<String, Object> map, String toGet) {
    try {
      return map.get(toGet).toString().replace("[", "").replace("]", "");
    } catch (Exception e) {
      return "";
    }
  }

  private RestHighLevelClient initClient() {
    return new RestHighLevelClient(
        RestClient.builder(
            new HttpHost("localhost", 9200, "http"), new HttpHost("localhost", 9201, "http")));
  }
}
