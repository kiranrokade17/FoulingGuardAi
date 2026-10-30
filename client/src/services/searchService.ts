interface SearchResult {
  title: string;
  url: string;
  snippet: string;
}

class SearchService {
  private async searchWeb(query: string): Promise<SearchResult[]> {
    try {
      // Using Wikipedia API for marine biofouling information
      const wikiResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent('Marine_biofouling')}`);
      const wikiData = await wikiResponse.json();
      
      const results: SearchResult[] = [];
      
      if (wikiData.extract) {
        results.push({
          title: 'Marine Biofouling - Wikipedia',
          url: wikiData.content_urls?.desktop?.page || 'https://en.wikipedia.org/wiki/Marine_biofouling',
          snippet: wikiData.extract
        });
      }
      
      // Add species-specific search if query contains species names
      const speciesKeywords = ['barnacle', 'mussel', 'algae', 'bryozoan', 'tubeworm'];
      const foundSpecies = speciesKeywords.find(species => query.toLowerCase().includes(species));
      
      if (foundSpecies) {
        try {
          const speciesResponse = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(foundSpecies)}`);
          const speciesData = await speciesResponse.json();
          
          if (speciesData.extract) {
            results.push({
              title: `${foundSpecies.charAt(0).toUpperCase() + foundSpecies.slice(1)} - Wikipedia`,
              url: speciesData.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${foundSpecies}`,
              snippet: speciesData.extract
            });
          }
        } catch (err) {
          console.log('Species search failed:', err);
        }
      }
      
      return results;
    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  async searchReportContext(reportContext: any, userQuery: string): Promise<string> {
    const searchQuery = `marine biofouling ${reportContext.species} cleaning methods ${userQuery}`;
    const results = await this.searchWeb(searchQuery);
    
    if (results.length === 0) {
      return `\n\nWEB SEARCH: No additional information found.\n`;
    }
    
    return `\n\nADDITIONAL RESEARCH INFORMATION:\n${results.map(r => 
      `Source: ${r.title}\nContent: ${r.snippet.substring(0, 300)}...\n`
    ).join('\n')}\nIntegrate this information naturally with the report analysis.\n`;
  }
}

export const searchService = new SearchService();