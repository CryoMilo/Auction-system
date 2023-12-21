const prompt = require('prompt-sync')({ sigint: true })

// Your code goes here!

// List of Auction Items
const initialItemList = [
  {
    itemNumber: 1,
    description: 'Vintage Cheese Wheel',
    bidCount: 0,
    reservePrice: 50,
    initialPrice: 0,
  },
  {
    itemNumber: 2,
    description: 'Organic Lemon Basket',
    bidCount: 0,
    reservePrice: 20,
    initialPrice: 0,
  },
  {
    itemNumber: 3,
    description: 'Antique Pocket Watch',
    bidCount: 0,
    reservePrice: 100,
    initialPrice: 0,
  },
  {
    itemNumber: 4,
    description: 'Rare Vinyl Record Collection',
    bidCount: 0,
    reservePrice: 150,
    initialPrice: 50,
  },
  {
    itemNumber: 5,
    description: 'Handcrafted Wooden Chair',
    bidCount: 0,
    reservePrice: 80,
    initialPrice: 0,
  },
  {
    itemNumber: 6,
    description: 'Vintage Leather Backpack',
    bidCount: 0,
    reservePrice: 120,
    initialPrice: 20,
  },
  {
    itemNumber: 7,
    description: 'Original Oil Painting',
    bidCount: 0,
    reservePrice: 200,
    initialPrice: 30,
  },
  {
    itemNumber: 8,
    description: "Collector's Edition Board Game Set",
    bidCount: 0,
    reservePrice: 60,
    initialPrice: 10,
  },
  {
    itemNumber: 9,
    description: 'Rare Gemstone Necklace',
    bidCount: 0,
    reservePrice: 180,
    initialPrice: 0,
  },
  {
    itemNumber: 10,
    description: 'Limited Edition Sneaker Pair',
    bidCount: 0,
    reservePrice: 90,
    initialPrice: 20,
  },
]

let itemList = initialItemList

let finalItemList = []

// Search Item Using ID
const findItem = (keyword) => {
  return itemList.find((item) => item.itemNumber === parseInt(keyword) || item.description.includes(keyword))
}

// Bid the item using BuyerId and ItemId
const bid = (buyerId, itemId, price) => {
  const itemToBid = findItem(itemId)

  console.log('\nCurrent Item Status => ')
  console.table(itemToBid)

  if (!itemToBid.hasOwnProperty('currentBid')) {
    itemToBid.currentBid = itemToBid.initialPrice
  }

  if (price > itemToBid.currentBid) {
    itemToBid.currentBid = parseInt(price)
    itemToBid.bidCount++
    itemToBid.currentBuyer = parseInt(buyerId)
    console.log(`\nBuyer ${buyerId} has overtaken the bid\n`)
    console.table(itemToBid)
  } else console.warn('\nBid price cannot be LOWER or EQUAL to the current bid\n')
}

// Announce the list of Winners at the end of Auction
const announceWinner = (finalData) => {
  finalData.map((item) => {
    if (item && item.currentBuyer && item.currentBid > item.reservePrice) {
      const companyFee = item.currentBid * 0.01
      const totalItemFee = item.currentBid + companyFee

      console.log(`${item.description} is sold to buyer ${item?.currentBuyer} with $${totalItemFee} \n`)
    }
  })
}

// Get items that are not sold
const getUnsoldItemList = (finalData) => {
  const unsoldItems = []

  finalData.map((item) => {
    if (!item.currentBid || item.currentBid < item.reservePrice) {
      unsoldItems.push({
        itemNumber: item.itemNumber,
        finalBid: !item.currentBid ? item.initialPrice : item.currentBid,
      })
    }
  })

  console.table(unsoldItems)
}

// Detail count data
const getCounts = (finalData) => {
  const soldItems = []
  const unSoldItems = []
  const noBidItems = []

  finalData.forEach((item) => {
    if (!item.currentBid) {
      console.log(`\n${item.description} - (${item.itemNumber}) didn't get any bids\n`)
      noBidItems.push(item.itemNumber)
    } else if (item.currentBid > item.reservePrice) {
      soldItems.push(item.itemNumber)
    } else {
      unSoldItems.push(item.itemNumber)
    }
  })

  console.log(`Items with no bids => ${noBidItems.length}`)
  console.log(`Items sold => ${soldItems.length}`)
  console.log(`Items didn't sell => ${unSoldItems.length}`)
}
// Call the Home Action Interface
const callHomeInterface = () => {
  switch (prompt('\n\nState your Action:\nS:Search\tB:Bid\tG:Get List\tE:End Auction\n')) {
    case 'S':
      const searchItem = prompt('Search item: ')
      const foundItem = findItem(searchItem)

      console.log('Current Highest Bid is =>' + foundItem.currentBid || foundItem.initialPrice)

      console.table(foundItem)

      break

    case 'B':
      const buyerId = prompt('Buyer Id: ')
      const itemId = prompt('Bid Item Id: ')
      const price = prompt('Set Price: ')

      if (buyerId && itemId && price) {
        {
          if (itemId < itemList.length + 1) {
            bid(buyerId, itemId, price)
          } else console.log('Invalid item id')
        }
      } else {
        console.log('🙏Please fill all required fields🙏')
        callHomeInterface()
      }
      break

    case 'G':
      console.log('\n------Item List------')
      console.table(itemList)

      break

    case 'E':
      finalItemList = itemList
      console.log('\n\n-------------------------------------------------------')
      console.log('\nEnd of Auction 🧑🏻‍⚖️\n')
      announceWinner(finalItemList)
      getUnsoldItemList(finalItemList)
      getCounts(finalItemList)
      console.log('\n-------------------------------------------------------\n\n')

    default:
      break
  }
  callHomeInterface()
}

// Start of Program
console.log('🎊Auction has started!🎊')

callHomeInterface()
