# SauceNAO parser
Simplified SauceNAO parser - https://saucenao.com/

## Start
Install this package through npm

```sh
$ npm install saucenao-parser
```
## Example usage
```javascript
const Sauce = require('saucenao-parser'),
      sauce = new Sauce({
          api_key: "YOUR_API_KEY"
      });
      
sauce.setOptions({
    numres: 2
});

const url = "https://tc-pximg01.techorus-cdn.com/img-master/img/2019/12/24/01/00/54/78448240_p0_master1200.jpg"
sauce.getSauce(url).then(console.log);

/*
> {
  header: {
    user_id: 0,
    account_type: 0,
    short_limit: '4',
    long_limit: '100',
    long_remaining: 99,
    short_remaining: 3,
    status: 0,
    results_requested: 2,
    index: {
      '0': [Object],
      '2': [Object],
      '5': [Object],
      '6': [Object],
      '8': [Object],
      '9': [Object],
      '10': [Object],
      '11': [Object],
      '12': [Object],
      '16': [Object],
      '18': [Object],
      '19': [Object],
      '20': [Object],
      '21': [Object],
      '22': [Object],
      '23': [Object],
      '24': [Object],
      '25': [Object],
      '26': [Object],
      '27': [Object],
      '28': [Object],
      '29': [Object],
      '30': [Object],
      '31': [Object],
      '32': [Object],
      '33': [Object],
      '34': [Object],
      '35': [Object],
      '36': [Object],
      '37': [Object],
      '51': [Object],
      '52': [Object],
      '53': [Object],
      '211': [Object]
    },
    search_depth: '128',
    minimum_similarity: 41.98,
    query_image_display: 'userdata/LZulLLPw5.jpg.png',
    query_image: 'LZulLLPw5.jpg',
    results_returned: 2
  },
  results: [
    { header: [Object], data: [Object] },
    { header: [Object], data: [Object] }
  ]
}
*/
```

## constructor(options?)
The constructor of Sauce accepts only one parameter - API key. This parameter is not required, then you will use Sauce API without api key and it will reduce some features.

You can
  - Get the API key here - https://saucenao.com/user.php?page=search-api
  - Read the information about features of SauceNAO API here - https://saucenao.com/user.php?page=account-upgrades

### Code Example
```javascript
const sauce = new Sauce({
    api_key: "YOUR_API_KEY"
});
```
## getSauce(source: Buffer|string, response_type?: number)
In order to get image data, you need to use the getSauce method, which takes two parameters. The first is the source of the image itself, it can be a link, a buffer, or a file on your disk. The second is the type of response that can take 4 different values.

Response type values
```javascript
  sauce.RESPONSE_TYPE.ORIGINAL // 0 - if you want to get the original data
  sauce.RESPONSE_TYPE.DEFAULT // 1 - if you want to get the handled data
  sauce.RESPONSE_TYPE.HIGHSIMILARITY // 2 - if you want to get the high similarity handled data
  sauce.RESPONSE_TYPE.ASSIGNED // 3 - if you want to get the the assigned data. (!IMPORTANT! This type may produce incorrect data.)
```

Code Example
```javascript
// For URL
const url = "https://server/path/to/image.jpg";
sauce.getSauce(url)

// For Buffer
const fetch = require('node-fetch');

const url = "https://server/path/to/image.jpg";
fetch(url)
    .then(response => response)
    .then(buffer => sauce.getSauce(await buffer));
    
// For Files
const path = `${__dirname}/image.jpg`; // If your file is in the same directory, I recommend using __dirname

sauce.getSauce(path);
```

## setOptions(options?)
If you want to use advanced search parameters, you need to call the setOptions method and specify the parameters you need.

You can
  - Find out what parameters can be used here - https://saucenao.com/user.php?page=search-api
  - Set default settings for your account here - https://saucenao.com/user.php?page=search-settings

### Code Example
```javascript
sauce.setOptions({
    numres: 15,
    depth: 350,
    minsim: "80!"
});
```

## generateDBMask(array: number[])
SauceNAO uses many different search services, each such service has its own unique index. By default, the search is performed on all indexes, but you can specify the indexes that you need.

For example, SauceNAO can search for information on Pixiv, its indices are 5 and 6. I will create an array with these indices and pass it as a parameter to this method. The method will return a bitmask of these indices, which I will pass to the setOptions method as the dbmask parameter so that the search is performed only on these indices or as the dbmaski parameter to exclude these indices from the search

You can
  - View list indicies here - https://saucenao.com/status.html

### Code Example
```javascript
const indexes = [5, 6];
const bitmask = sauce.generateDBMask(indexes);

sauce.setOptions({
    dbmask: bitmask
    // dbmaski: bitmask 
})

console.log(bitmask); // 96
```


