import { useState, useEffect, useCallback, useMemo, useLayoutEffect, useRef } from "react";
import * as XLSX from "xlsx";

const FACILIO_LOGO = "data:image/png;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4gHYSUNDX1BST0ZJTEUAAQEAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADb/2wBDAAUDBAQEAwUEBAQFBQUGBwwIBwcHBw8LCwkMEQ8SEhEPERETFhwXExQaFRERGCEYGh0dHx8fExciJCIeJBweHx7/2wBDAQUFBQcGBw4ICA4eFBEUHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh4eHh7/wAARCADIAMgDASIAAhEBAxEB/8QAHQABAQACAwEBAQAAAAAAAAAAAAECCAUGBwQDCf/EADkQAAIBAwIFAgMGBAUFAAAAAAABAgMEEQUGBwghMUESURNhcRQiN3SRsRUjdbMWJzaBsjNVhKHC/8QAGwEBAQEBAQEBAQAAAAAAAAAAAAECBAMFBgf/xAAwEQEAAQMCBAMHAwUAAAAAAAAAAQIDEQQFEhMhMTJBURQVInGBobEGQmE0NVKR0f/aAAwDAQACEQMRAD8A8aAI+5/VXaeGYlb7kz0YEZARsAT3KYhkfkgZH2AmSMr7ELAjZjkpH3AjZARsAyAj7gMkfkZ7kAjZGysjZoQmRkgB9gYtgmEy53JA30MWzLYyZDZAI+4ACSjZH5DZMhAxyMkb7gGYtlfkhRGyAjYBsxK33IBGQr7kbAhMlMWygQNkbKIMhsxb6dSdxH5BGwVMOdbIx7k9zDaN9yPuV+SBAxK2R9giPyRsrMX3APosEYyTJcCEfcNkAjZGykYEI33KYgPchW+5jkoN9yN9wQoGIDJIxbIw/JGyogACudfkhCdzDRkAxDIyeCvsQCZIwQBnuYt9w2RsohGUxbAMgI+wB9yPsCPyAMS5IywI+5PcPsTPcoGLZX5Mc9AkjZiZGIUAAHN5IAYVPBMgLL6IIhMn6/Z6vocvQ8fQ/F+3sI6iMj7AhQb7mLZX3MfcAR+Q/YgAj7mdKEqk1Fd28H3z0TUI03N0KmEs9IPsZqrpp8U4apoqq8MZcYzF9jJp5aw8royOMsPozcMsc9yPufVp9lcXtV0renKpLGcRTb/RH7aho9/Y0nVr21aFNNJylBpL/donHTE4yzNyiJ4Znq45+SPsDFvoaaG/YxfXJX5MQkAACgAA5ojfzDIYA7vwU2c9675tNGnOVOhLNSvNd1TXfHzfRf7nR136m1/JttTTVotbeMalV33rq2Tjn7no+5LOPfKPn7pqvZtNVXHftHzYrnEPTKuxNhbX2vd/D0bTLeELeade5jFyk/S8ZnLuzQW5adzWaxj4jxjtjLP6FcU9laZvrbEtI1WvcUreEvjfyZYbaTwn8jSDZ2xtS3RvKtt/RqLqShcTh6pdFCEZNOUn4SSPjbBfpii5XcrzPnnyYtzjMy6hh47Mxw+uEbkaBy07StrGMNYv768uWl6pUZKnBPyksNtfocZX5ZtHp7moVaGoXFTR5xkq1NtKrTljo0/Kfk743/STMxmf9NcyGpLT8oxNlOPvBTa+y+HN5uHTLm+nc0KtGEY1ZJxalNRecL2bPFOG2ytW3rr1LSdKofEqzXqlJ9IU4JrMpPwllfqkd2n3CzfszepnFMerUVxMZdVUW+0WyNPysM3K27yz7VtrOMda1G8vK7X3vgNUoJ+y6NtfocdvXlh0a4sKlXbGp3FC6jFuFK5xKE37OSw1+hxRv+jmrhzPzx0Z5kNSbWap1oyfZM9aqX1l9lkvtdD/AKb6fEXt9TzvU9Av9D3VV0LWLaVvdUK3w6sJLqnnuvdNdU/KZtVfctexYaJWulc6j64W7qL767qOfb3PDeqrFXLmurHfGIz6P0GyfqCraOZw0cXHjzxjGf8ArWXhXpNluDiPpGjX6lK1vb+FGoovDcXLDw/HQ2O4tcCtjaBw61rW7CleK6srZ1aTlWbWU13Xk8B4FwhS407cpwz6aer0orPsp4RufzA/g3uj8jL90eO66m7a1dqiiqYicfl+euVTNbSDhRdUKG5ouvUhTi6UvvTaS8eWdw4sX1lW2fWp0LqhUqOrDEYVE21n2TOK5dNl6VvrfP8AA9XlVjbu1qVvVTaUsxax38dWeg8xnBbauxdifx7SK15K5VzTpYqyTjhvD7I7tRqLMa2miqZ4px5Pkaraab+uo1U1YmnHTHpLXFvoFFvsmztnDXY+sb21ynpek27q1JL1Sk+kacE0nKT8JZX7G0W2eWPa1raRWt6ld3ldpepUMU4p+ybTbX1SOnV7pp9JPDcnr6Q+zVXENL2mujTRibkbx5XdvXdlUltzVLm1uVFuELnE4SfzaSa/Q1T3vtfVto7guNE1m1lb3NF4afaS8NPyn4aN6PctPrOluevotNUS4MAHe0AADmGxkZIYEbNguSzWtW/xleaA76q9L+w1blWzx6VV9dNer3zh47+TXzPU915KvxRu/wClVf7lI+bu1MTo68+jFzwvX+bbcWvbb2BaXWganW0+4q3kadSpTSzKDTyuqZxvJrpFGnsnUNxVIqV7fXcqc6jX3mo4b6/Nyz/svYx52n/lrYf1CP7M+bko3HbXezdR25KqvtdncuuoN9ZQmkm0vZNL9UfmqaJjaZqpj93X5PLHwvi5sOLm5dq6za7U2pcKwrTt1cXV4oqU0m2lCKaaXRZbxnqsYw8/Nyq8Xd1bj3JU2ruq7/iLnRlVtrqUFGcXHDcW0kmmn06Z+ZzfMxwe1XeesW+5NvKnVuqdBULi3lL0uaTbUot9G+uGvkj8uW3g5q+0ddqbk3DGNvXjSdO3t4yTeX3csdvkkekToPd3lx4+uVzTwuy83/4H6l+Ztv7sTg+S/Rba22Fe638OP2m8u3S9eOvohFYX6t/+jnOcD8DtT/MW392J1jkl3HbXezdS23OqleWd068YN9XSmkspfJxefqjxtxV7oq4f8uv2T9rhubbirurb25rXa219RnpkI26rXVekk6k3JvEU2nhJYfTD6nTNoc0G8tG0WGn6vpVtrtem3i7q1HTnJeE0lhte/Q9L5nuEGt7w1603Jt6jG5qqiqFzQ9SUnhvElno1jo0da2hyw3l5o0LjXdTWnXcm/wCRCmp+leG37/I7dNVtvsdHNxnz9c/lYmnHV5JxF4gVOI29bLXa+i0NLuIU4UaipVHNVMSbTeUuqTx9EvY301L/AEtc/kpf8GaKcWNlabsPiBa7fstX/iNeMIVbj+Wo/CbbxHv3wk/o0b16l/pa5/JS/wCDPHeeXy7HK8PXH2K8dMNCuB/427f/AKxD+4bm8wP4N7o/Iy/dGmXBD8btv4/7xD+4bm8wP4N7o/Iy/dHtvP8AW2fp+Vq8UNYOSz8W1/T6/wD8HtPOqs8IF+eo/ueK8ln4tr+n1v3ge086v4P/APnUf3Zdb/d7f0J8bDk00K1suG9bWVTi7m/uJRlPHVQgkks/Vt/p7HUObPi/ujb26ae0NrXktMVKjCrd3MIp1JuSyoptPCSw+nVtnYuSjdFnqGw7vbkq0Vfafcup8N9G6U0sNe+Gnn2yvc+Tmb4LazvDcdPdO3Ywr1p0Y0rm3clGbceikm+jWMJr5HNTyo3Wv2rt179v4+ydOLqy5SOKm493177bu6LpX1a3oqtb3UopTks4cZYwn7p4yfJz16DaT2xo25Y04xu6V39jnJLDlCUZSWX8nDp9Wc/yxcJNT2NVu9a15RpXlxSVGlQi03COcttry/Y6vz2bns1o+jbRpVYzu53Lva0YtNwhGMoxz7Zc3j6M1am3O7Uzpu38fLqRji6NTgAftXuAADlyMNj3MCHfOBnEO04b7vra5fadc39GdlO3VKg4qSblBp9Wlj7r/U6EzFnnes03rc26+0pMZh7Rx4446TxJ2rbaLYaDqFhUpXKrOpcTg4tJYwvS28nlmz9za1tHX7fXtBupULug/rGcfMZLymvBxPT2IeVjRWrFnk0x8JFMRGG1G3+bLRXYRjr+2dQpXsY/fdpKM6U38stNZ+ZwdzzVXNbeFtdQ0C4o7eoRn67eM4u4ryaxFtt4SXXomzXFpexDhjYtHEzPD3Z5cPeuNPMFovEDYN1tmy29qdlWr1aVRVq84OCUJqTTSbfVLB4ztHcmtbT16hrmgXkrW9oPo11jNPvGS8p+UcVhLsiHZp9DZ09qbVMfDKxTERhtRtnmz0z7FTp7l2ze07tLE6lnOM6b+eG01n2ON3xzYVLmxqW2zdu1revNOKur9pqHzUIt5f1aNaHh90Tp9Djp2LRxXxcP36Jy4fXcapfXmsVdY1G5q3d7Wq/GrVZvMpyzlts2duua/blbSatitp6ypzt3SUviUsZcWs9+2TVZmPTr0OvVbbY1PDzI8PZZpiXYdh7kp7b35pe5q9vVrUbO/hdTo02lOUVLLSb6Z+p7lxJ5mdB3VsfV9u2u2dWtq19bujCrVqU/TBtrq8PPjwa1ka+g1G3Wb9ym5XHWnsTTEu+cC9/2nDre8dwXtjcX1BW1Si6VBpSbljDy2lhYO98eOPejcRtk/wCHrDQdRsav2iFX4tecHHEXlro28ngz/UxXQtzbrN2/F+qPig4YmcuX2fuXWtpa/b65oF5K1vKDypLrGa8xkvKflGy+1ebbT/skKW59s3cLpLEqtlOMoSfvhtNZ9lk1RBNZtun1c5uR19SaIltPvPm0ozsJ0No7buI3Uk0q9/JKEH7qMW22vZ4NZ9wazqm4NZutZ1q8qXl9dT9VWrN5b9kl4SXRI+DALpNusaTrbjqU0xHYAB3NAAA5VsjZTExAEb6MNkbKI2TPcPyAJ7kBGwGe5MggAxZWyMsCEbGSFAwz0K30ZH5CI2QAKAAAAAAAAAADlGzH36lI2ZAxLnuYgRshWyACPuH3I2BCNlz3MW+5YBsgfcFEZGDFvr7k7iNk9w2QpAAAAAAAAAAAAAA5IjKzHPcyBi/JWyPyBCNlMQBC5IUR9iMEbKBiytkyBi2RsrMWwiAAKAAAAAAAAAAAAAORfcxbKQyI2QEYBsme4J7gCZKYvsWAb7mLY9yMoGLfcyfYwfkJIYgBQAAAAAAAAAAAAAAAH3tkbAMiEb7gARkAAxI2AaEZACSMW+piwCpCAAKAAAAAAAAAAAAAAAA//9k=";

const FALLBACK = [
  { account:"ICD BP Phase-1", vertical:"CRE", region:"ME", phase:"Hypercare", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Ashwin, Sandhiya, Harish, Robin, Dinesh, Vasanth", comments:"Customer is yet to Sign-off", plannedGoLive:"31/08/2023", actualGoLive:"31/08/2023", clientPOC:"Sandeep", sowPlanStart:"", sowPlanEnd:"", plannedStart:"15-May-2023", actualStart:"15-May-2023", plannedBRDSub:"", actualBRDSub:"", plannedBRDSignoff:"", actualBRDSignoff:"Customer has not signed BRD Officiall\r\n\r\nGave a email confirmation", plannedUATStart:"", actualUATStart:"", plannedUATSignoff:"", actualUATSignoff:"", projectPlan:"Project Plan", msa:"MSA", governanceFolder:"ICD Brookfield Place", brd:"", wsr:"ICD-WSR", functionalTestReport:"" },
  { account:"ICD BP Phase-2\r\n\r\n", vertical:"CRE", region:"ME", phase:"Hypercare", rag:"Amber", status:"Active", lead:"Ashwin", consultant:"Ashwin, Sandhiya, Harish, Robin, Dinesh", comments:"The UAT sign-off for Phase 02 kickstarted\r\n\r\nAwaiting Customer Sign-off \r\n\r\nThe UAT sign-off for Phase 02 is paused now.\r\n\r\nShall resume back again from 15th of July.. \r\n\r\n----------------------------------------------------------------------\r\n\r\nRevive Migration is handed over by Product on 6th August & We have dropped a Version Upgrade to Customer.. Follow up is planned  on 13th August\r\n\r\n", plannedGoLive:"12 March 2024\r\n5 March 2024\r\n23-Febr-2024\r\n08-Feb-2024\r\n05-Feb-2024\r\n31-JAN-2024 \r\n31 March 2024\r\n15 April 2024\r\n30 April 2024\r\n15 May 2024\r\n31 May 2024\r\n6 June 2024\r\n30 June 2024\r\nJuly 15 2024\r\nAug 15 2024\r\nHoping to Close the account by 31st August\r\nSept 15 2024\r\nOCT 30 2024\r\nNov 22 2024\r\nDec 6 (WCP Go live)\r\nMobile Phase 2 Live - 10-Oct-2025\r\n17-Nov-2025\r\n", actualGoLive:"\r\n6th Dec 2024 (WCP)\r\n", clientPOC:"Sandeep", sowPlanStart:"", sowPlanEnd:"", plannedStart:"05 Dec 2023\r\n20-Nov-2023\r\n13-Nov-2023\r\n21-Aug-2023\r\n", actualStart:"06-Dec-2023", plannedBRDSub:"", actualBRDSub:"", plannedBRDSignoff:"", actualBRDSignoff:"Customer has not signed BRD Officiall\r\n\r\nGave an email confirmation", plannedUATStart:"08/11/2024", actualUATStart:"08/11/2024", plannedUATSignoff:"31-Nov-2024", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"ICD Brookfield Place", brd:"", wsr:"", functionalTestReport:"" },
  { account:"Trinity Hospital", vertical:"CRE", region:"US", phase:"Hypercare", rag:"Green", status:"Active", lead:"Sangavi", consultant:"Jhimlee Datta", comments:"", plannedGoLive:"31-Mar-2025\r\n2-May-2025\r\nP1 - 9-May-2025\r\nP2 - 05-Jun-2025\r\nP3 - 15-Jul-2025\r\nPhase 2 - 6/23/2025\r\nPhase 3 - 7/14/2025\r\nPhase 4 - 7/28/2025\r\nPhase 1 - 6/2/2025\r\nPhase 2 - 9/22/2025\r\nFinal Phase - 11/17/2025\r\n\r\n", actualGoLive:"Phase 1 - 6/2/2025\r\nPhase 2 - 9/22/2025", clientPOC:"Rebecca A. Barta", sowPlanStart:"01-Jun-2024", sowPlanEnd:"31-Mar-2025", plannedStart:"05-Jun-2024", actualStart:"05-Jun-2024", plannedBRDSub:"29-Aug-2024", actualBRDSub:"29-Aug-2024", plannedBRDSignoff:"13-Sep-2024\r\n15-Oct-2024", actualBRDSignoff:"12-Nov-2024", plannedUATStart:"1/17/2025\r\n11-Mar-2025\r\n24-Mar-2025", actualUATStart:"24-Mar-2025", plannedUATSignoff:"5/1/2025\r\n5/30/2025", actualUATSignoff:"10-Sep-2025", projectPlan:"https://app.smartsheet.com/sheets/rQQxPF4W36RFhFXWJpH88Cc6FX7g3WxJwPGqqxM1", msa:"Trinity-Software-as-a-Service-Agreement-Order-Form-and-SOW-fully-executed (2).pdf", governanceFolder:"Trinity Health Clinical Engineering", brd:"29-Aug-2024", wsr:"WSR - \r\nhttps://docs.google.com/spreadsheets/d/1C6LPX38HATe3guIiFRDHxyllwmklV6IROSReXkRn3co/edit?gid=0#gid=0\r\n\r\nhttps://app.smartsheet.com/sheets/Hv9HgwqG4P4fJ2rVvRG6P27Q447chv9r4QQFJch1?view=grid", functionalTestReport:"" },
  { account:"Al Mujama - Wave 1", vertical:"CRE", region:"ME", phase:"Hypercare", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Harish M", comments:"04-Mar-2025 - AL Mujama Starts Utilizing the system for their Maintenance and PPM Activities. \r\n\r\n\r\nClient wants to start Workshops from Aug 27 2024, Since Project kick off done on Jul 24 2024\r\n", plannedGoLive:"\r\nFeb 12 2025\r\nNov 07 2024", actualGoLive:"06/02/2025", clientPOC:"Jawad", sowPlanStart:"25-Jul-2024", sowPlanEnd:"17-Dec-2024", plannedStart:"25-Jul-2024", actualStart:"25-Jul-2024", plannedBRDSub:"17-Oct-2024", actualBRDSub:"17-Oct-2024", plannedBRDSignoff:"23-Oct-2024", actualBRDSignoff:"23-Dec-2024", plannedUATStart:"29/11/2024", actualUATStart:"06/01/2025", plannedUATSignoff:"27/12/2024", actualUATSignoff:"06/12/2024", projectPlan:"https://app.smartsheet.com/sheets/4rXcGX92Mj2mMJ3h53mrJ9g7c55r9Xjc7HXxxFJ1?view=grid", msa:"Facilio CAFM (Mujama) + Anacity", governanceFolder:"https://facilio958-my.sharepoint.com/my?id=%2Fpersonal%2Fharishm%5Ffacilio%5Fcom%2FDocuments%2FAl%20Mujama%20%2D%20New", brd:"17-Oct-2024", wsr:"https://facilio958-my.sharepoint.com/:x:/g/personal/harishm_facilio_com/ERq6mlUOhGRIpeA8iBa9fUIBXomeqmRntfccF4r86C9zhw?e=JLCQH1", functionalTestReport:"https://facilio958-my.sharepoint.com/:x:/r/personal/harishm_facilio_com/_layouts/15/Doc.aspx?sourcedoc=%7B1D967CB8-E482-4FA8-BBFD-6BE56C4A8C16%7D&file=Al%20Mujama%20-%20Functional%20Testing%20Report.xlsx&action=default&mobileredirect=true" },
  { account:"Al Mujama - Wave 2", vertical:"CRE", region:"ME", phase:"Hypercare", rag:"Amber", status:"Active", lead:"Ashwin", consultant:"Dinesh", comments:"", plannedGoLive:"17/12/2024", actualGoLive:"TBD", clientPOC:"Jawad / Akshay", sowPlanStart:"25-Jul-2024", sowPlanEnd:"17-Dec-2024", plannedStart:"24-Sep-2024", actualStart:"24-Sep-2024", plannedBRDSub:"07-Nov-2024", actualBRDSub:"14-Nov-2024", plannedBRDSignoff:"15-Nov-2024", actualBRDSignoff:"23-Dec-2024", plannedUATStart:"15-Mar-2025\r\n18 -Nov-2024", actualUATStart:"TBD", plannedUATSignoff:"28/11/2024", actualUATSignoff:"TBD", projectPlan:"", msa:"", governanceFolder:"", brd:"07-Nov-2024", wsr:"", functionalTestReport:"" },
  { account:"IEM ", vertical:"IFM", region:"UK", phase:"Hypercare", rag:"Red", status:"Active", lead:"Vandhana", consultant:"Harish/Deepika/Krishna Karthikeyen", comments:"", plannedGoLive:"Milestone 2 : YTD\r\n\r\nMilestone 1 : \r\nRegion 6 - April 7th 2025\r\nRegion 5 - April 23rd 2025\r\nRegion 3 and 4 - May 12th 2025\r\nRegion 1 and 2 - June 2nd 2025\r\nMarch 17th\r\n\r\nOverall Go Live - Jun 30th 2025\r\n\r\n", actualGoLive:"Milestone 1:\r\nRegion 6 - April 7th 2025\r\nRegion 5 - April 23rd 2025", clientPOC:"Jamie Franklin\r\nChristy Smith", sowPlanStart:"", sowPlanEnd:"", plannedStart:"Aug 22nd 2024", actualStart:"Aug 22nd 2024", plannedBRDSub:"Oct 18th 2024", actualBRDSub:"M1 - Oct 23rd 2024", plannedBRDSignoff:"M2 - YTD \r\nM1 - Oct 22nd 2024", actualBRDSignoff:"M1 - Dec 18th 2024", plannedUATStart:"M2: YTD \r\nApril 24th 2025\r\nMarch 24th 2025\r\n\r\nM1: \r\nReactive  UAT - Jan 7th 2025\r\nPM UAT - Feb 12th 2025\r\nFeb 4th 2025\r\n", actualUATStart:"Reactive Request - Dec 24th 2024\r\nQuoted Request - Jan 13th 2025\r\nPM - Jan 31st 2025", plannedUATSignoff:"M2 - YTD\r\nMay 7th 2025\r\nApril 24th 2025\r\nMarch 24th 2025\r\n\r\nM1 - May 1st 2025\r\nApril 7th 2025\r\nMarch 17th 2025\r\nFeb 2nd 2025\r\nPM - May 23rd [Estimated]\r\n", actualUATSignoff:"30-Jun-2025", projectPlan:"Project Plan ", msa:"IEM - SOW", governanceFolder:"IEM ", brd:"Oct 18th 2024", wsr:"WSR ", functionalTestReport:"Reactive FTR \r\nPM FTR " },
  { account:"Unilodge ( Phase 2)", vertical:"CRE", region:"AUS", phase:"Go-Live", rag:"Amber", status:"Active", lead:"Mithun", consultant:"Jeffri", comments:"Vendor Onboarding in progress", plannedGoLive:"TBD", actualGoLive:"TBD", clientPOC:"Marlita Foster ,Olivianti Desicius", sowPlanStart:"", sowPlanEnd:"", plannedStart:"TBD", actualStart:"TBD", plannedBRDSub:"NA", actualBRDSub:"NA", plannedBRDSignoff:"TBD", actualBRDSignoff:"TBD", plannedUATStart:"TBD", actualUATStart:"TBD", plannedUATSignoff:"", actualUATSignoff:"", projectPlan:"https://app.smartsheet.com/sheets/J4WxPCQPHXj6vM3WhpfhxCHV28Pf4H6WXmVfv6Q1", msa:"https://drive.google.com/file/d/1pqHuXS4vvOOXjVt_OjogdKH3QIt3tn67/view?usp=sharing", governanceFolder:"", brd:"NA", wsr:"", functionalTestReport:"" },
  { account:"Skeens ( Phase 2)", vertical:"IFM", region:"US", phase:"On-Hold", rag:"Red", status:"Active", lead:"Mithun", consultant:"Jeffri", comments:"They are unable to make the vendors use the platform so SMS integration though demoed has not been implemented", plannedGoLive:"", actualGoLive:"", clientPOC:"Riley Skeens", sowPlanStart:"", sowPlanEnd:"", plannedStart:"", actualStart:"", plannedBRDSub:"", actualBRDSub:"", plannedBRDSignoff:"", actualBRDSignoff:"", plannedUATStart:"", actualUATStart:"", plannedUATSignoff:"", actualUATSignoff:"", projectPlan:"https://app.smartsheet.com/sheets/J4WxPCQPHXj6vM3WhpfhxCHV28Pf4H6WXmVfv6Q1", msa:"https://drive.google.com/file/d/1pqHuXS4vvOOXjVt_OjogdKH3QIt3tn67/view?usp=sharing", governanceFolder:"", brd:"", wsr:"", functionalTestReport:"" },
  { account:"Kingsmede", vertical:"CRE", region:"AUS", phase:"Transitioned to support", rag:"Green", status:"Active", lead:"Sangavi", consultant:"Ranjan", comments:"", plannedGoLive:"12/16/2024\r\n14th Feb 2025\r\n3-Mar-2025", actualGoLive:"3/3/25", clientPOC:"Natashia Steed", sowPlanStart:"", sowPlanEnd:"", plannedStart:"8-Oct-2024", actualStart:"8-Oct-2024", plannedBRDSub:"18-Oct-2024", actualBRDSub:"18-Oct-2024", plannedBRDSignoff:"25-Oct-2024", actualBRDSignoff:"Nov-19-2024", plannedUATStart:"9-Dec-2024", actualUATStart:"10-Dec-2024", plannedUATSignoff:"7-Feb-2025", actualUATSignoff:"", projectPlan:"https://app.smartsheet.com/sheets/xfpR5Ch7Cc2297XpR9jF28X2x42hM3mMp5p95381?view=grid", msa:"Kingsmede-Facilio Service Order & MSA - Clean.docx", governanceFolder:"Kingsmede Governance Folder", brd:"18-Oct-2024", wsr:"Kingsmede <> Facilio - WSR", functionalTestReport:"" },
  { account:"JSY-PAHAYTC", vertical:"IFM", region:"APAC", phase:"UAT", rag:"Red", status:"Active", lead:"Vandhana", consultant:"Anantha Sai", comments:"Budget Reconciliation and Reallocation feature is not available in Facilio but below was highlighted to DARe,\r\n\r\n1. History tab will be enabled for Budget by Jun 18th 2025\r\n2.  Entire solution if required will be created as feature in facilio by Sep 2025 if DARe agreed to pay", plannedGoLive:"YTD\r\nBoth Waves - May 12th (Estimated)\r\nBy 2nd Week of March, Exact date TBD\r\nWave 1 & 2 - 03-Mar-2025\r\nWave 1 - 07-Feb-2025\r\nWave 2 -10-Feb-2025\r\nWave 1 - 27-Dec-2024\r\nWave 2 - 10-Jan-2025\r\nWave 1 - 20-Dec-2024\r\nWave 2 - 10-Jan-2025\r\nWave 1 - 4-Dec-2024\r\nWave 2 - 6-Jan-2025", actualGoLive:"TBD", clientPOC:"Marc Robson, Fabian Ngo", sowPlanStart:"", sowPlanEnd:"", plannedStart:"24-Sept-2024", actualStart:"24-Sept-2024", plannedBRDSub:"-", actualBRDSub:"3-Dec-2024", plannedBRDSignoff:"6-Dec-2024\r\n14-Oct-2024", actualBRDSignoff:"19-Dec-24", plannedUATStart:"Wave 1-20-Dec-2024\r\nWave 2 - 17-Jan-2025\r\n\r\nWave 1-13-Dec-2024 \r\nWave 2-06-Jan-2025\r\n\r\nWave 1-21-Nov-2024 \r\nWave 2- 26-Dec-2024", actualUATStart:"Wave 1 - 23 Dec 2024\r\nWave 2 - 27 Jan 2025", plannedUATSignoff:"YTD\r\nMay 9th 2025\r\n7th March 2025", actualUATSignoff:"", projectPlan:"", msa:"JSY- License Distribution Agreement-Fully Executed.pdf", governanceFolder:"JSY Governance Folder ", brd:"-", wsr:"WSR - JSYPHT", functionalTestReport:"" },
  { account:"Saudi Tabreed (Phase - 1)", vertical:"CRE", region:"ME", phase:"Hypercare", rag:"Red", status:"Active", lead:"Ashwin", consultant:"Arun Kumar", comments:"Delay in Integration requirement gathering & BRD preparation", plannedGoLive:"2-Feb-2025\r\n", actualGoLive:"2-Feb-2024\r\n", clientPOC:"Hana Al Saleh", sowPlanStart:"30-Oct-2024", sowPlanEnd:"02-Feb-2025", plannedStart:"19-Aug-2024", actualStart:"19-Aug-2024", plannedBRDSub:"03-Nov-2024", actualBRDSub:"03-Nov-2024", plannedBRDSignoff:"30-Oct-2024", actualBRDSignoff:"10-Dec-2024", plannedUATStart:"22-Jan-2025\r\n", actualUATStart:"22-Dec-2025\r\n", plannedUATSignoff:"12/12/2025", actualUATSignoff:"16/02/2026", projectPlan:"Saudi Tabreed Plan", msa:"ST - License & Scope Document", governanceFolder:"Saudi Tabreed Folder", brd:"03-Nov-2024", wsr:"Overall Status & WSR - Saudi Tabreed - Master.xlsx", functionalTestReport:"ST - UAT Testcase - Phase 1.xlsx" },
  { account:"Saudi Tabreed (Phase - 2)", vertical:"CRE", region:"ME", phase:"Hypercare", rag:"Red", status:"Active", lead:"Ashwin", consultant:"Arun Kumar", comments:"Delay in Integration requirement gathering & BRD preparation", plannedGoLive:"\r\n2-Mar-2025", actualGoLive:"15/09/2025", clientPOC:"Hana Al Saleh", sowPlanStart:"01-Dec-2024", sowPlanEnd:"24-Feb-2025", plannedStart:"19-Aug-2024", actualStart:"19-Aug-2024", plannedBRDSub:"03-Nov-2024", actualBRDSub:"03-Nov-2024", plannedBRDSignoff:"30-Oct-2024", actualBRDSignoff:"10-Dec-2024", plannedUATStart:"20/02/2025", actualUATStart:"\r\n24-Feb-2025", plannedUATSignoff:"16/02/2026", actualUATSignoff:"13/06/2025", projectPlan:"", msa:"", governanceFolder:"", brd:"03-Nov-2024", wsr:"", functionalTestReport:"" },
  { account:"Deyaar - DCM", vertical:"CRE", region:"ME", phase:"UAT", rag:"Amber", status:"Active", lead:"Ashwin", consultant:"Arun Kumar", comments:"Phase 1 Live\r\nPhase 2 in UAT", plannedGoLive:"P1: 31-Jan-2025\r\n17-Feb-2025\r\nP2: 15-May-2025\r\n17-July-2025", actualGoLive:"P1: 1-Mar-2025\r\nP2: TBD", clientPOC:"Abdul Ajees\r\nPragadeesh", sowPlanStart:"01-Oct-2024", sowPlanEnd:"30/06/2025", plannedStart:"16-Oct-2024", actualStart:"16-Oct-2024", plannedBRDSub:"P1: 22-Nov-2024\r\nP2: 17-Jan-2025\r\n17-Feb-2025", actualBRDSub:"P1: 27-Nov-2024\r\nP2: 18-March-2025", plannedBRDSignoff:"P1: 10-Dec-2024\r\nP2: 03-Feb-2024", actualBRDSignoff:"P1: 18-Dec-2024\r\nP2: 10-April-2025", plannedUATStart:"P1: 26-Dec-2024\r\n03-Jan-2025\r\nP2: 20-April-2025", actualUATStart:"P1: 06-Jan-2025\r\nP2: 16-Jun-2025", plannedUATSignoff:"P1:22-Jan-2025\r\n29-Jan-2025\r\nP2: 05-May-2025", actualUATSignoff:"P1: 03-Feb-2025\r\nP2: TBD", projectPlan:"https://app.smartsheet.com/sheets/j6h8wF39Hw8m4f8rfxjC5jhjvJ8J6MXwj4jcRqm1", msa:"DCM MSA", governanceFolder:"Deyaar", brd:"P1: 22-Nov-2024\r\nP2: 17-Jan-2025\r\n17-Feb-2025", wsr:"WSR", functionalTestReport:"HSE FTR.xlsx" },
  { account:"Deyaar - DPM", vertical:"CRE", region:"ME", phase:"Configuration", rag:"Amber", status:"Active", lead:"Ashwin", consultant:"Arun Kumar", comments:"Phase 1 ready for Live\r\nPhase 2 In UAT", plannedGoLive:"P1: 21-Jan-2025\r\n20-Feb-2025\r\nP2: 15-May-2025\r\n17-July-2025", actualGoLive:"", clientPOC:"Abdul Ajees\r\nAnto", sowPlanStart:"01-Oct-2024", sowPlanEnd:"30/06/2025", plannedStart:"16-Oct-2024", actualStart:"16-Oct-2024", plannedBRDSub:"P1: 22-Nov-2024\r\nP2: 23-Jan-2025\r\n23-Feb-2025", actualBRDSub:"P1: 27-Nov-2024", plannedBRDSignoff:"P1: 10-Dec-2024\r\nP2: 07-Feb-2024\r\n", actualBRDSignoff:"P1: 18-Dec-2024", plannedUATStart:"P1: 26-Dec-2024\r\n03-Jan-2025\r\nP2: 20-April-2025", actualUATStart:"P1: 06-Jan-2025", plannedUATSignoff:"", actualUATSignoff:"", projectPlan:"Deyaar Project", msa:"Deyaar Project", governanceFolder:"Deyaar Project", brd:"P1: 22-Nov-2024\r\nP2: 23-Jan-2025\r\n23-Feb-2025", wsr:"WSR", functionalTestReport:"" },
  { account:"Charter Hall", vertical:"CRE", region:"AUS", phase:"Transitioned to support", rag:"Green", status:"Active", lead:"Sangavi", consultant:"Bala Kiruthika", comments:"", plannedGoLive:"7/8/2025\r\n14th July 2025", actualGoLive:"14th July 2025", clientPOC:"Georgina", sowPlanStart:"", sowPlanEnd:"", plannedStart:"5-Nov-2024", actualStart:"5-Nov-2024", plannedBRDSub:"The BRD is being released on a module/use-case basis, beginning on November 20, with the final BRD scheduled for release by December 10.", actualBRDSub:"", plannedBRDSignoff:"15 Dec 2024\r\n23-Dec-2024", actualBRDSignoff:"Sign off has been received for all use cases BRd before Dec 20 2024.\r\nSign off on Build doc,SSO and Sharepoint is pending", plannedUATStart:"5/1/2025\r\n5/5/2025", actualUATStart:"", plannedUATSignoff:"30-Jun-2025", actualUATSignoff:"30-Jun-2025", projectPlan:"https://app.smartsheet.com/sheets/m8jC4QM6JcmGJcMW3JwRF6rJhX37Pm5rjRxG8Wm1?view=gantt", msa:"", governanceFolder:"CH Project Folder", brd:"The BRD is being released on a module/use-case basis, beginning on November 20, with the final BRD scheduled for release by December 10.", wsr:"WSR  - Charter Hall.xlsx", functionalTestReport:"" },
  { account:"Mansions", vertical:"CRE", region:"ME", phase:"Hypercare", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Dinesh", comments:"1) Mansions inspection module requiremnet session has been held and access has been provided for the repective users\r\n2) Requiremenyt call has been scheduled (30-Oct-2025) to proceed further with the inspection\r\n3) Followup email sent for the sign off Hazard and Incident module", plannedGoLive:"07/04/2025", actualGoLive:"07/04/2025", clientPOC:"Ambrosio", sowPlanStart:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/EloK5VoOEVhEiFlOjVu-vXYBMUHTJNkKves28OFAP5VOPA?e=2nfxba", sowPlanEnd:"", plannedStart:"12-Nov-2024", actualStart:"12-Nov-2024", plannedBRDSub:"09-Dec-2024", actualBRDSub:"25-Dec-2024", plannedBRDSignoff:"12/10/2024\r\n08/01/2025\r\n15/01/2025", actualBRDSignoff:"22-Jan-2025", plannedUATStart:"18/02/2025", actualUATStart:"12/02/2025", plannedUATSignoff:"12/03/2025", actualUATSignoff:"12/03/2025", projectPlan:"https://app.smartsheet.com/sheets/C8qMh24M6XmpCX6hqVj49VQ89CGCRwvmRCX6jH31?view=grid", msa:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/EvGcoKIXNZRMm6r5BxP_pFcBUwbsE3BoRsLlcazzYoZFzQ?e=hm9kIF", governanceFolder:"Mansions", brd:"09-Dec-2024", wsr:"Mansions WSR", functionalTestReport:"Mansions UAT Testcase.xlsx" },
  { account:"Metro Maintenance Phase 1", vertical:"IFM", region:"US", phase:"Hypercare", rag:"Amber", status:"Active", lead:"Vandhana", consultant:"Nivetha/Krishna", comments:"-Unavailability of client POC for 3 weeks\r\n-CorrigoPro being Unresponsive to the client , hence sandbox has had delays\r\n- API token authentication issue with corrigo is causing more delays\r\n-UAT is extended till May 15 as client is taking longer than expected to adjust to Facilio\r\n-Past 2 weeks have been delayed due to exhaustion of engagement hours with corrigo support & metro agreed that Facilio is not responsible\r\n ", plannedGoLive:"September 1\r\nJuly 7th\r\n7 - May - 2025\r\n28-April-2025\r\n23-April-2025 ", actualGoLive:"", clientPOC:"Cristy Thomas", sowPlanStart:"", sowPlanEnd:"", plannedStart:"6-Dec-2024", actualStart:"6-Dec-2024", plannedBRDSub:"30-Dec-2024", actualBRDSub:"30-Jan-2025", plannedBRDSignoff:"3-Jan-2025", actualBRDSignoff:"25-Feb-2025", plannedUATStart:"28th April 2025\r\n24th April 2025\r\n4th April 2025", actualUATStart:"29-Apr-2025", plannedUATSignoff:"May 15th 2025", actualUATSignoff:"", projectPlan:"https://app.smartsheet.com/sheets/vP66f2rwJFV6QvG9w45Mpr24PWqjVxrm98f8vhv1?view=gantt", msa:"https://facilio958-my.sharepoint.com/:b:/g/personal/inbaraj_facilio_com/EZAO5O3NV0NJqmHU5IQBThIBH9fBd8z9esRAOHJZZfwa7g?e=nuxssb", governanceFolder:"Metro Maintenance", brd:"30-Dec-2024", wsr:"WSR - Metro Maintenance - Facilio Week 1.xlsx", functionalTestReport:"https://facilio958-my.sharepoint.com/:x:/g/personal/krishna_k_facilio_com/EZHIbmsowhREhe5uCmqf_WwBpNTCF0DoqokZ8ei3F8ExbQ?e=g9O2US" },
  { account:"Metro Maintenance Phase 2 ", vertical:"IFM", region:"US", phase:"Configuration", rag:"Green", status:"Active", lead:"Vandhana", consultant:"Nivetha/Krishna", comments:"", plannedGoLive:"Phase 2 - 17-June-2025\r\nAug 15th\r\nOct 24th\r\nNov 27th", actualGoLive:"", clientPOC:"Cristy Thomas", sowPlanStart:"", sowPlanEnd:"", plannedStart:"", actualStart:"", plannedBRDSub:"30-Dec-2024", actualBRDSub:"30-Jan-2025", plannedBRDSignoff:"3-Jan-2025", actualBRDSignoff:"25-Feb-2025", plannedUATStart:"Nov 13th\r\nAugust 4th\r\n6/13/2025", actualUATStart:"", plannedUATSignoff:"", actualUATSignoff:"", projectPlan:"https://app.smartsheet.com/sheets/qVmg5wvwpWgmC3H3W8xCP4W4F9QrjjHhRC8Whc41?view=gantt", msa:"https://facilio958-my.sharepoint.com/:b:/g/personal/inbaraj_facilio_com/EZAO5O3NV0NJqmHU5IQBThIBH9fBd8z9esRAOHJZZfwa7g?e=nuxssb", governanceFolder:"Metro Maintenance", brd:"30-Dec-2024", wsr:"WSR - Metro Maintenance - Facilio Week 1.xlsx", functionalTestReport:"" },
  { account:"Chicago Maintenance", vertical:"IFM", region:"ME", phase:"Transitioned to support", rag:"Green", status:"Active", lead:"Ashwin", consultant:" Riyavarshini", comments:"Transitioned to Support.\r\nAll Modules has been configured and has been Handedover to CMC.\r\nModules which has been On holded for Integration such as PR, PO , Inventory Management has been configured as per the requirements gathered. Which shall be subjected to re-configuration later as per the integration scope.", plannedGoLive:"Phase 1: 10-Feb-2025\r\nPhase 1: 11-Feb-2025\r\nPhase 2: 02-Apr-2025\r\nPhase 2: 01-Apr-2025", actualGoLive:"Phase 1 : 11-Feb-2025\r\nPhase 2 : PPM - 01-Mar-2025\r\nInspection : 28 - Mar - 2025\r\nInventory Management : 2 - May - 2025\r\nPR & PO : 9 - Jun -2025", clientPOC:"Arun Varghese/ Rinto Raju", sowPlanStart:"SOW Signed - 23-Nov-2024", sowPlanEnd:"", plannedStart:"18-Dec-2024", actualStart:"18-Dec-2024", plannedBRDSub:"13-Jan-2025", actualBRDSub:"14-Jan-2025", plannedBRDSignoff:"21-Jan-2025", actualBRDSignoff:"06-Feb-2025", plannedUATStart:"Phase 1: 31-Jan-2025\r\nPhase 2: 14-Mar-2025", actualUATStart:"Phase 1 : 31-Jan-2025\r\nPhase 2 : \r\nPPM: 21-Feb-2025\r\nInspection: 28-Mar-2025\r\nPR PO : 05 - May -2025\r\nPR PO: 29 - May -2025", plannedUATSignoff:"Phase 1 : 05-Feb-2025\r\nPhase 1 : 10-Feb-2025\r\nPhase 2 : 26-Mar-2025", actualUATSignoff:"Phase 1 : 10-Feb-2025\r\nUAT for PPM Module: 21-Feb-2025\r\nInspection : 28-Mar-2025\r\nInventory Modules: 02-May-2025\r\nProcurement Modules : 11-May-2025", projectPlan:"https://facilio958.sharepoint.com/:f:/s/ConnectedCMMS/EvKM4KdhOl9LnL9Us_4Ur7YBr8fdtxv5y8mkVERiuZu0YA?e=Bg2eVf", msa:"Chicago Maintenance and Construction- SO, MSA & SOW", governanceFolder:"Chicago Maintenance & Construction", brd:"13-Jan-2025", wsr:"WSR - Chicago Maintenance", functionalTestReport:"Overall Function Test Report" },
  { account:"MAF - Al Zahia", vertical:"CRE", region:"ME", phase:"Hypercare", rag:"Amber", status:"Active", lead:"Ashwin", consultant:"Riya", comments:"Ready to be transferred to support, scheduled support transition call on 04-May-2026", plannedGoLive:"Phase 1 : 08-May-2025\r\n09-Apr-2025\r\n17-Mar-2025\r\n\r\nPhase 2 : 08-May-2025\r\n09-Apr-2025\r\n20-Mar-2025\r\n\r\nPhase 3 : 01-Jul-2025\r\n15-May-2025\r\n15-Apr-2025\r\n25-Mar-2025", actualGoLive:"Phase 1 : 15-Jun-2025\r\nPhase 2 : 15-Jun-2025\r\nPhase 3 : ", clientPOC:"Shirin L", sowPlanStart:"16/01/2025", sowPlanEnd:"01-May-2025", plannedStart:"16-Jan-2025", actualStart:"16-Jan-2025", plannedBRDSub:"NA", actualBRDSub:"NA", plannedBRDSignoff:"NA", actualBRDSignoff:"NA", plannedUATStart:"Phase 1 : 11-Mar-2025\r\n\r\nPhase 2 : 14-Mar-2025\r\n\r\nPhase 3 : 31-Mar-2025\r\n19-Mar-2025", actualUATStart:"Phase 1 : 11-Mar-2025\r\nPhase 2 : 17-Mar-2025\r\nPhase 3 : 03-Apr-2025", plannedUATSignoff:"Phase 1 : 31-Mar-2025\r\n17-Mar-2025\r\n\r\nPhase 2 : 08-Apr-2025\r\n20-Mar-2025\r\n\r\nPhase 3 : 08-May-2025\r\n10-Apr-2025\r\n25-Mar-2025", actualUATSignoff:"Phase 1 : 03-Apr-2025\r\nPhase 2 : 03-Apr-2025\r\nPhase 3 : ", projectPlan:"MAF AZ - Project Plan", msa:"", governanceFolder:"MAF-AZ Governance Folder", brd:"NA", wsr:"MAF AZ - WSR", functionalTestReport:"" },
  { account:"MHA", vertical:"CRE", region:"UK", phase:"Hypercare", rag:"Green", status:"Active", lead:"Vandhana", consultant:"Livin, Nivetha, Ananth", comments:"", plannedGoLive:"Wave 2 -  28/11/25\r\nWave 2 -  30/10/25\r\nWave 1 - 18/07/25", actualGoLive:"NA", clientPOC:"Caroline Bruno", sowPlanStart:"Dec 18th 2024", sowPlanEnd:"April 22nd 2025", plannedStart:"21-Jan-2025", actualStart:"21-Jan-2025", plannedBRDSub:"4-Apr-2025", actualBRDSub:"V2 Submitted - Apr 10th2025\r\nV1 Submitted - Apr 8th 2025\r\nDraft Submitted - Apr 1st 2025", plannedBRDSignoff:"16-Apr-2025", actualBRDSignoff:"Apr 22nd 2025", plannedUATStart:"Wave 2 -  17/11/25\r\nWave 2 -  20/10/25\r\nWave 1 - 08/07/25", actualUATStart:"NA", plannedUATSignoff:"Wave 2 -  27/11/25\r\nWave 2 -  30/10/25\r\nWave 1 - 18/07/25", actualUATSignoff:"NA", projectPlan:"MHA Project Plan_Revised_28th Jul 2025", msa:"MHA-Facilio SO, MSA & SOW- Fully Executed.pdf", governanceFolder:"MHA UK", brd:"4-Apr-2025", wsr:"[WSR]-MHA-Facilio.xlsx", functionalTestReport:"MHA - FTR" },
  { account:"QSP Site & Power", vertical:"CRE", region:"ME", phase:"Transitioned to support", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Dinesh, Danush", comments:"", plannedGoLive:"5/25/2025\r\n1/10/2025\r\n3/11/2025\r\n06/11/2025", actualGoLive:"TBD", clientPOC:"Ranjith RadhaKrishnan", sowPlanStart:"", sowPlanEnd:"", plannedStart:"13/01/2025", actualStart:"13/01/2025", plannedBRDSub:"06-Mar-2025\r\n28-Feb-2025", actualBRDSub:"06/03/2025", plannedBRDSignoff:"27-Mar-2025\r\n17-Mar-2025", actualBRDSignoff:"25/03/2025", plannedUATStart:"24/04/2025", actualUATStart:"12/09/2025", plannedUATSignoff:"5/15/2025\r\n21-09-2025\r\n21/10/2025\r\n31/10/2025", actualUATSignoff:"TBD", projectPlan:"https://app.smartsheet.com/sheets/5wGfg85Hwh3Gj75VGF9Ww8w7VGmpCfq68JFgxM81", msa:"Facilio-QSP- SO Form", governanceFolder:"https://facilio958-my.sharepoint.com/my?id=%2Fpersonal%2Fharishm%5Ffacilio%5Fcom%2FDocuments%2FQatar%20Site%20%26%20Power", brd:"06-Mar-2025\r\n28-Feb-2025", wsr:"https://facilio958-my.sharepoint.com/:x:/g/personal/harishm_facilio_com/EYDa53GOeVlNtb21o8vCmigBwikFegt0vi5ZdmQMPWP6gA?CID=2080a92c-c28e-0f21-60d2-8314d476b45d", functionalTestReport:"QSP UAT Testcase.xlsx" },
  { account:"Avar-Phase 2", vertical:"IFM", region:"UK", phase:"UAT", rag:"Amber", status:"Active", lead:"Vandhana", consultant:"Nivetha", comments:"", plannedGoLive:"YTD\r\n30 July 2025\r\n25 July 2025\r\n4/18/2025", actualGoLive:"", clientPOC:"Wael, Jason", sowPlanStart:"", sowPlanEnd:"", plannedStart:"27/01/2024", actualStart:"28/01/2024", plannedBRDSub:"05-Mar-2025", actualBRDSub:"05-Mar-2025", plannedBRDSignoff:"07-Mar-2025", actualBRDSignoff:"May 12 2025", plannedUATStart:"July 10 2025\r\n04-Oct-2025", actualUATStart:"July 10 2025", plannedUATSignoff:"YTD\r\nJuly 28 2025\r\nJuly 18 2025\r\n4/17/2025", actualUATSignoff:"", projectPlan:"https://app.smartsheet.com/sheets/6wFP4FJ5w6GFhWx29x3RwGWmrqRjxfJfq765WJr1?view=grid", msa:"Facilio-AvarGlobal-Connected CAFM - Proposal Addendum for New Requirements_23rd July 2024.docx (1) 1.pdf", governanceFolder:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/EoLnnDy8a3hBsmeUPHREtGcBOl-i6b9rkZ6DO1WXowvLyw?e=cI5pe2", brd:"05-Mar-2025", wsr:"https://facilio958-my.sharepoint.com/:x:/r/personal/nivethad_facilio_com1/_layouts/15/Doc.aspx?sourcedoc=%7B1394FD57-6367-46D5-8444-DA325ECF094C%7D&file=WSR%20-%20%5BFacilio%20-%20Avar%20Global%5D%201.xlsx&action=default&mobileredirect=true&ct=1741250324715&wdOrigin=OFFICECOM-WEB.START.UPLOAD&cid=9ad24a01-5f37-455b-bdc2-79c047a8c669&wdPreviousSessionSrc=HarmonyWeb&wdPreviousSession=b93f2435-9178-43c9-9a0c-d7cafb37e2f1", functionalTestReport:"" },
  { account:"Dalkia - Misk city", vertical:"IFM", region:"ME", phase:"Configuration", rag:"Red", status:"Churned", lead:"Mithun", consultant:"Manoj", comments:"Account is churned", plannedGoLive:"TBD", actualGoLive:"", clientPOC:"Malik", sowPlanStart:"https://docs.google.com/document/d/1EDD3uZlp_C6UCLKKDSTMQRYRWw2G4-_-cEZgkbakEJk/edit?usp=sharing", sowPlanEnd:"", plannedStart:"23/10/2024", actualStart:"23/10/2024", plannedBRDSub:"NA", actualBRDSub:"NA", plannedBRDSignoff:"NA", actualBRDSignoff:"", plannedUATStart:"TBD", actualUATStart:"", plannedUATSignoff:"TBD", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"NA", wsr:"", functionalTestReport:"" },
  { account:"Cognita (RPS, HIS, HES)\r\nRGS Expansion", vertical:"CRE", region:"ME", phase:"Transitioned to support", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Vasanth V", comments:"Data Collection in Progress for all 3 Campus.\r\n\r\nWorkshop Session has to be conducted for Work Permit Module (Planned Start Date - TBD)", plannedGoLive:"31/07/2025", actualGoLive:"", clientPOC:"Overall -Riyas, Najeem\r\nHES/HIS Campus - Sabu Mathew, Amor\r\nRPS Campus - Joseph , Santhruban", sowPlanStart:"", sowPlanEnd:"", plannedStart:"10-Mar-2025", actualStart:"06-Mar-2025", plannedBRDSub:"NA", actualBRDSub:"NA", plannedBRDSignoff:"NA", actualBRDSignoff:"NA", plannedUATStart:"18/07/2025", actualUATStart:"", plannedUATSignoff:"23/07/2025", actualUATSignoff:"", projectPlan:"Cognita Project Plan", msa:"Cognita MSA and SOW", governanceFolder:"Cognita Project Governance", brd:"NA", wsr:"Cognita WSR", functionalTestReport:"" },
  { account:"Ace Hardware", vertical:"IFM", region:"US", phase:"Hypercare", rag:"Green", status:"Full Scope Dleivered and Fully Live", lead:"Deepak Simon", consultant:"William Stordeur", comments:"Go Live email received on 23rd Oct 2025", plannedGoLive:"22-Jun-2025", actualGoLive:"23-Sep-2025", clientPOC:"Brad Thomas", sowPlanStart:"2-Jan-2025", sowPlanEnd:"24-Mar-2025", plannedStart:"2-Apr-2025", actualStart:"2-Apr-2025", plannedBRDSub:"12-Apr-2025", actualBRDSub:"14-Apr-2025", plannedBRDSignoff:"21-Apr-2025", actualBRDSignoff:"26-May-2025", plannedUATStart:"22-May-2025", actualUATStart:"18-Jun-2025", plannedUATSignoff:"22-Jun-2025", actualUATSignoff:"1-Jul-2025", projectPlan:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/Ea8L7rcoNnlDjAX37zKgT40Bj9Q1OG53vBwnJftpRT99BA?e=fLp8mt", msa:"https://facilio958-my.sharepoint.com/:b:/g/personal/shivaraj_facilio_com/Eah0izNJW9xKv1aqR1NALE4B1RyAPvYe_KOrN3ZPNfdmSg?e=s1BrbW", governanceFolder:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/EqDmAjDmr25HgMh_98gPS2cB8m8SvnjSAUGRUzGm_ESydw?e=ui0yqe", brd:"12-Apr-2025", wsr:"https://facilio958-my.sharepoint.com/:x:/g/personal/william_stordeur_facilio_com/EYA4w6Q5J5xIlCyMkWt9o-EB7bBlFQF56RBJtb0uGJQQWQ?e=KQyNyB", functionalTestReport:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/Ea0bBrBMZr5Pil7HjDDq148BK0-6zVwBGlDl1vf3CHSF7A?e=e1LFcu" },
  { account:"Silal", vertical:"CRE", region:"ME", phase:"Hypercare", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Arun Kumar", comments:"Ready to be transferred to support, yet to get confirmation from customer", plannedGoLive:"09/07/2025", actualGoLive:"13/10/2025", clientPOC:"Naglaa", sowPlanStart:"11-Apr-2025", sowPlanEnd:"09-Jul-2025", plannedStart:"10-Mar-2025", actualStart:"10-Mar-2025", plannedBRDSub:"02-Apr-2025", actualBRDSub:"09-Jun-2025", plannedBRDSignoff:"10-Apr-2025", actualBRDSignoff:"09-Jun-2025", plannedUATStart:"05/05/2025", actualUATStart:"10/06/2025", plannedUATSignoff:"17/06/2025", actualUATSignoff:"10/09/2025", projectPlan:"Silal Project Plan", msa:"Elitser-Service Order (Silal)- Fully Executed.pdf", governanceFolder:"https://facilio958-my.sharepoint.com/shared?id=%2Fpersonal%2Fshivaraj%5Ffacilio%5Fcom%2FDocuments%2FG%2DDrive%2821%2D12%2D24%29%2Fswami%40facilio%2Ecom%2FFacilio%20%2D%20OnBoarding%2FSilal%2FPre%20Implementation&listurl=%2Fpersonal%2Fshivaraj%5Ffacilio%5Fcom%2FDocuments&login_hint=arunkumar%2Ev%40facilio%2Ecom&source=waffle", brd:"02-Apr-2025", wsr:"https://facilio958-my.sharepoint.com/:x:/r/personal/shivaraj_facilio_com/_layouts/15/Doc.aspx?sourcedoc=%7B0BC7DFA2-E008-4EF9-BBDC-884583F3B5CF%7D&file=WSR%20-%20Silal%20-%20Master.xlsx&action=default&mobileredirect=true", functionalTestReport:"https://facilio958-my.sharepoint.com/:x:/r/personal/shivaraj_facilio_com/_layouts/15/Doc.aspx?sourcedoc=%7B7ECDECB9-9335-4BEE-A59A-6324C90FED64%7D&file=Silal%20-%20UAT%20Testcase%20-.xlsx&action=default&mobileredirect=true" },
  { account:"In Collaborative", vertical:"CRE", region:"US", phase:"Transitioned to support", rag:"Green", status:"Full Scope Dleivered and Fully Live", lead:"Deepak Simon", consultant:"Muthu", comments:"Go Live email received on 22nd Oct 2025", plannedGoLive:"18-Sep-2025 - Phase 1 - Portfoili, Asset, SR, WO\r\n29-Sep-2025 - Phase 2 - QR Code SR, PM, Job Plan", actualGoLive:"2-Oct-2025", clientPOC:"David Fall - david.falls@incollaborative.com", sowPlanStart:"16-Jun-2025", sowPlanEnd:"14-Aug-2025", plannedStart:"17-Jun-2025", actualStart:"18-Jun-2025", plannedBRDSub:"26-Jun-2025\r\n27-Jun-2025", actualBRDSub:"27-Jun-2025\r\n29-Jun-2025", plannedBRDSignoff:"27-Jun-2025", actualBRDSignoff:"1-Jul-2025", plannedUATStart:"28-Jul-2025\r\n31-Jul-2025", actualUATStart:"30-Jul-2025", plannedUATSignoff:"6-Aug-2025", actualUATSignoff:"6-Aug-2025", projectPlan:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/EQevI8jicxFPt6WNYyaEXKcBGV9EywycQblCggDOVpJd9w?e=bsC2Im", msa:"https://facilio958-my.sharepoint.com/:b:/g/personal/shivaraj_facilio_com/EUsGIXRHLNdEgMwQczZBHOcBhb8TPAoTKCQ9hXQBItsJmQ?e=ypstct", governanceFolder:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/En53dt59kshGm2Dy0zr-Xr4BedPu23wEJPqfsd3REF19Xw?e=5fXrRh", brd:"26-Jun-2025\r\n27-Jun-2025", wsr:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/Ebm1mNHETOhNpMev1u5ZEb0BCP9un0qoQ9OeXLqJGoT76Q?e=ZqkKPC", functionalTestReport:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/EqfcB5URbY1KiSxDHnt5xgYBkXVS75n8hj0_enGjr3nkfg?e=WbslBk" },
  { account:"Hibernia", vertical:"CRE", region:"UK", phase:"UAT", rag:"Green", status:"Active", lead:"Deepak Simon", consultant:"Inbaraj", comments:"", plannedGoLive:"31-Dec-2025\r\n31-Oct-2025", actualGoLive:"", clientPOC:"Bernard MacOscair", sowPlanStart:"", sowPlanEnd:"", plannedStart:"5-Jun-2025", actualStart:"5-Jun-2025", plannedBRDSub:"\r\n24-Jun-2025", actualBRDSub:"", plannedBRDSignoff:"25-Jul-2025\r\n26-Jun-2025", actualBRDSignoff:"07-Aug-2025\r\n30-Jul-2025", plannedUATStart:"Phase 1 : 09-Sep-2025\r\nPhase 2 : 23-Oct-2025\r\nPhase 3 : 28-Nov-2025\r\n01-Oct-2025", actualUATStart:"9-Sep-25", plannedUATSignoff:"29-Dec-2025\r\n28-Oct-2025", actualUATSignoff:"", projectPlan:"Hibernia Project Plan - Sep 1st", msa:"MSA - Hibernia", governanceFolder:"Hibernia", brd:"\r\n24-Jun-2025", wsr:"WSR - Hibernia", functionalTestReport:"FTR - Hibernia" },
  { account:"Spectra", vertical:"IFM", region:"ME", phase:"UAT", rag:"Red", status:"Active", lead:"Ashwin", consultant:"Paurnika, Niviya", comments:"No response from customer for a long time and now customer is available to continue the engagement", plannedGoLive:"TBD\r\n31-Mar-2026\r\n10-Oct-2025", actualGoLive:"TBD", clientPOC:"EL Hussain", sowPlanStart:"14-Jul-2025", sowPlanEnd:"12-Jan-2026", plannedStart:"14-Jul-2025", actualStart:"14-Jul-2025", plannedBRDSub:"08-Sep-2025", actualBRDSub:"04-Sep-2025", plannedBRDSignoff:"15-Sep-2025", actualBRDSignoff:"15-Sep-2025", plannedUATStart:"29-Sep-2025", actualUATStart:"01-Oct-2025", plannedUATSignoff:"27-Mar-2026\r\n18-Jan-2026\r\n28-Dec-2025\r\n09-Oct-2025", actualUATSignoff:"TBD", projectPlan:"", msa:"Spectra - Signed Agreement.pdf", governanceFolder:"Spectra Support Services", brd:"08-Sep-2025", wsr:"WSR", functionalTestReport:"" },
  { account:"Brookfield(UK) - Additional Building", vertical:"IFM", region:"UK", phase:"Transitioned to support", rag:"Amber", status:"Full Scope Dleivered and Fully Live", lead:"Deepak Simon", consultant:"Inbaraj/Livin", comments:"Aldgate Tower -  2-Dec-2025\r\n30Fenchruchstreet - 1-Apr-2026\r\nOne Leadenhall - 1-Apr-2026", plannedGoLive:"30FS - 04-Dec-2025\r\nAT - 16-Sep-2025\r\nAT - 14-Aug-2025\r\nOne Leadenhall - 1-Apr-2026\r\n30FS - 1-Apr-2026", actualGoLive:"__", clientPOC:"Adam Stubley", sowPlanStart:"__", sowPlanEnd:"__", plannedStart:"30 FS - 29-Sep-2025\r\nAT - 23-Jun-2025", actualStart:"30 FS - 29-Sep-2025\r\nAT- 23-June-2025", plannedBRDSub:"__", actualBRDSub:"__", plannedBRDSignoff:"__", actualBRDSignoff:"__", plannedUATStart:"30 FS - 22-Oct-2025\r\nAT- 15-Sep-2025\r\nAT- 28-Jul-2025\r\nAT - 25-Jul-2025", actualUATStart:"30 FS - 22-Oct-2025", plannedUATSignoff:"30FS - 04-Dec-2025\r\nAT - 15-Sep-2025\r\nAT - 13-Aug-2025", actualUATSignoff:"__", projectPlan:"Project Plan", msa:"", governanceFolder:"Brookfield", brd:"__", wsr:"WSR - Brookfield", functionalTestReport:"FTR" },
  { account:"Binghatti Masaken", vertical:"CRE", region:"ME", phase:"UAT", rag:"Red", status:"Active", lead:"Ashwin", consultant:"Dinesh", comments:"The project is marked Red primarily due to significant customer-side delays, lack of responsiveness, complications from engaging new vendors, and unresolved BRD and UAT sign-offs—all of which have caused the project timeline to slip substantially from the original Go-Live date of 15-Jan-2026.", plannedGoLive:"30-Apr-2026\r\n15-Mar-2026\r\nPhase 1 - 18-Dec-2025\r\nPhase 2 - 5-Jan-2026", actualGoLive:"TBD", clientPOC:"Muhammad Ishtiaq", sowPlanStart:"09-Feb-2025", sowPlanEnd:"01-Mar-2026", plannedStart:"02-Sep-2025", actualStart:"02-Sep-2025", plannedBRDSub:"CAFM BRD - 9-Oct-2025\r\n\r\nCRM Integration BRD - 2-Oct-2025\r\n\r\nERP Inegration BRD -  17-Oct-2025", actualBRDSub:"Consolidated BRD - 05/02/2026\r\n\r\nCAFM BRD (1 & 2) 14-Oct-2025 & 19-OCT-25\r\n\r\nCRM Integration BRD - 19-Oct-2025\r\n\r\nERP Inegration BRD -  19-Oct-2025", plannedBRDSignoff:"27-Oct-2025\r\n\r\nCRM Integration BRD - 14-Oct-2025\r\n\r\nERP Inegration BRD -  05-Nov-2025", actualBRDSignoff:"04-Mar-2026", plannedUATStart:"Phase 1 - 5-Dec-2025\r\nPhase 2 - 26-Dec-2025", actualUATStart:"26-Jan-2026\r\n12-Jan-2026 & 13-Jan-2026", plannedUATSignoff:"28-Feb-2026\r\nPhase 1 - 17-Dec-2025\r\nPhase 2 - 01-Jan-2026", actualUATSignoff:"TBD", projectPlan:"Facilio-Binghatti Masaken Project Plan", msa:"20250630 Binghatti- Service Order Form+ MSA TC MA-Facilio signed (1).pdf", governanceFolder:"01_Project Governance", brd:"CAFM BRD - 9-Oct-2025\r\n\r\nCRM Integration BRD - 2-Oct-2025\r\n\r\nERP Inegration BRD -  17-Oct-2025", wsr:"Binghatti WSR", functionalTestReport:"" },
  { account:"Woodmans Market", vertical:"IFM", region:"US", phase:"Hypercare", rag:"Green", status:"Active", lead:"Deepak Simon", consultant:"Hasina J", comments:"1st December - 2025 - UAT\r\n05th March 2026 - Go Live email received", plannedGoLive:"15-Dec-2025\r\n5-Jan-2026\r\n2-Feb-2026\r\n5-Mar-2026", actualGoLive:"5-Mar-2026", clientPOC:"Dan Gergersen, Josh Branch", sowPlanStart:"15-Jul-2025", sowPlanEnd:"11-Nov-2025", plannedStart:"18-Aug-2025", actualStart:"18-Aug-2025", plannedBRDSub:"5-Sep-2025\r\n12-Sep-2025", actualBRDSub:"12-Sep-2025", plannedBRDSignoff:"11-Sep-2025\r\n18-Sep-2025\r\n25-Sep-2025", actualBRDSignoff:"25-Sep-2025", plannedUATStart:"13-Nov-2025\r\n17-Nov-2025\r\n1-Dec-2025", actualUATStart:"1-Dec-2025", plannedUATSignoff:"04-Dec-2025\r\n1-Dec-2025\r\n23-Dec-2025\r\n28-Jan-2026\r\n1-Mar-2026", actualUATSignoff:"NA", projectPlan:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/EbTXl3MaF9VEo0Sulek29GYBK_0lHEtmypOqPuzAhuMHDw?e=wgdk4a", msa:"https://facilio958-my.sharepoint.com/:b:/g/personal/shivaraj_facilio_com/Ech1lYvon5dPncVYS_NQo3ABmQguGf-SV_uxFr3c52IIhg?e=mEoqPS", governanceFolder:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/EqHc0418jnJLih4rbW-jvfYB8My3UICtWl9P4eXcQ3JVOw?e=2TULIT", brd:"5-Sep-2025\r\n12-Sep-2025", wsr:"https://facilio958-my.sharepoint.com/:x:/r/personal/shivaraj_facilio_com/_layouts/15/doc2.aspx?sourcedoc=%7B9ADDB416-EC2A-4C0C-8A63-05957064967A%7D&file=Woodmans%20WSR%20-%20Copy.xlsx&action=default&mobileredirect=true", functionalTestReport:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/ER5J1Y7F19JGjDTpV897WTkBV_JIl3sSd1tpQMkqWptRjA?e=EIIvRe" },
  { account:"Westhab - CAFM", vertical:"IFM", region:"US", phase:"Hypercare", rag:"Amber", status:"Full Scope Dleivered and Fully Live", lead:"Deepak Simon", consultant:"Hasina J", comments:"1-Dec-2025 - BRD Approved", plannedGoLive:"24-Nov-2025\r\n14-Jan-2026\r\n16-Mar-2026\r\n30-Mar-2026", actualGoLive:"1-Apr-2026", clientPOC:"Veronica Espinal", sowPlanStart:"25-Aug-2025", sowPlanEnd:"24-Nov-2025", plannedStart:"26-Aug-25", actualStart:"26-Aug-2025", plannedBRDSub:"23-Sep-2025\r\n10-Nov-2025\r\n15-Nov-2025", actualBRDSub:"\r\n19-Nov-2025", plannedBRDSignoff:"26-Sep-2025\r\n10-Nov-2025\r\n1-Dec-2025", actualBRDSignoff:"1-Dec-2025", plannedUATStart:"3-Nov-2025\r\n9-Jan-2026\r\n20-Jan-2026\r\n9-Feb-2026", actualUATStart:"10-Feb-2026", plannedUATSignoff:"13-Nov-2025\r\n12-Jan-2026\r\n25-Feb-2026\r\n20-Mar-2026", actualUATSignoff:"NA", projectPlan:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/Eu_oO_iKwWRAji9lVYg3DOUBMIZPFkPb6FpnEb8uI1dz8Q?e=BShViW", msa:"https://facilio958-my.sharepoint.com/:b:/g/personal/shivaraj_facilio_com/EY5Fnje2HPxPq0BcS2UG39wBzZxB0WN_tVFF357Q7bGGIQ?e=BOVOZw", governanceFolder:"https://facilio958-my.sharepoint.com/shared?id=%2Fpersonal%2Fshivaraj%5Ffacilio%5Fcom%2FDocuments%2FG%2DDrive%2821%2D12%2D24%29%2Fswami%40facilio%2Ecom%2FFacilio%20%2D%20OnBoarding%2FWesthab%2F01%5FProject%20Governance&listurl=%2Fpersonal%2Fshivaraj%5Ffacilio%5Fcom%2FDocuments", brd:"23-Sep-2025\r\n10-Nov-2025\r\n15-Nov-2025", wsr:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/IQBLGRN13vHQR4OVyOMjW7G_ATwI9YwUNt-aYv-2HKiGhwo?e=Lz8ke8", functionalTestReport:"" },
  { account:"HG Facilities Solutions - wave 1", vertical:"IFM", region:"US", phase:"Transitioned to support", rag:"Green", status:"Full Scope Dleivered and Fully Live", lead:"Deepak Simon", consultant:"Muthu, Hasina", comments:"8-Dec-2025 - Go Live email confirmation", plannedGoLive:"2-Jan-2026\r\n9-Dec-2025", actualGoLive:"9-Dec-2025", clientPOC:"Ryan McDonagh, Nicole Vernazzaro", sowPlanStart:"16-Oct-2025", sowPlanEnd:"26-Mar-2026", plannedStart:"10-Oct-2025", actualStart:"22-Oct-2025", plannedBRDSub:"4-Nov-2025", actualBRDSub:"7-Nov-2025", plannedBRDSignoff:"30-Oct-2025\r\n7-Nov-2025", actualBRDSignoff:"10-Nov-2025", plannedUATStart:"16-Dec-2025\r\n2-Dec-2025", actualUATStart:"2-Dec-2025", plannedUATSignoff:"22-Dec-2025\r\n8-Dec-2025", actualUATSignoff:"8-Dec-2025", projectPlan:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/ET_SvOerWA9OsKVBT8Bl-TABVzE0mKeA_O17gehePnq-cQ?e=qyA22n", msa:"https://facilio958-my.sharepoint.com/:b:/g/personal/shivaraj_facilio_com/Eeqqtc5_8gROiiEcD4zjaKQBstbRcn1t6VVmMDcpQU0pwA?e=L45GeB", governanceFolder:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/EuYbNSUKu7lFgQo_9-fNkFgB8DO3BW6BIII70xjO0GR9_A?e=ueIvxp", brd:"4-Nov-2025", wsr:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/Eccp_SEZpzBOkJQzxbI0GgcBeomFD_c7XvdQwmsHqBVTzg?e=RvopLY", functionalTestReport:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/EarWe3aVnd1LtYGpWx4IHE8BMRJzT3dyuifGXHdZuOxR1g?e=wTRUJQ" },
  { account:"CBRE", vertical:"IFM", region:"AUS", phase:"UAT", rag:"Green", status:"Active", lead:"Sangavi", consultant:"Jhimlee", comments:"", plannedGoLive:"2/13/2026\r\n3/16/2026", actualGoLive:"", clientPOC:"Abhishek", sowPlanStart:"18-Aug-25", sowPlanEnd:"", plannedStart:"18-Aug-25", actualStart:"18-Aug-25", plannedBRDSub:"8-Sep-25", actualBRDSub:"12-Sep-25", plannedBRDSignoff:"10-Sep-25", actualBRDSignoff:"17-Oct-25", plannedUATStart:"17-Nov-2025 ; 08-Dec-2025", actualUATStart:"17-Nov-2025 ; 08-Dec-2025 ; Jan 5 2026", plannedUATSignoff:"23-Jan-26", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"8-Sep-25", wsr:"", functionalTestReport:"" },
  { account:"FC Madras", vertical:"CRE", region:"APAC", phase:"Configuration", rag:"Amber", status:"Active", lead:"Vandhana", consultant:"Adhithyan, Hairsh", comments:"", plannedGoLive:"4-Nov-2025", actualGoLive:"", clientPOC:"Saravanan", sowPlanStart:"10-Oct-25", sowPlanEnd:"4-Nov-25", plannedStart:"10-Oct-25", actualStart:"10-Oct-25", plannedBRDSub:"15-Oct-25", actualBRDSub:"15-Oct-25", plannedBRDSignoff:"17-Oct-25", actualBRDSignoff:"", plannedUATStart:"23-Oct-25; 30-Oct-25", actualUATStart:"", plannedUATSignoff:"24-Oct-25; 31-Oct-25", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"https://facilio958.sharepoint.com/sites/ConnectedCMMS/Shared%20Documents/Forms/AllItems.aspx?id=%2Fsites%2FConnectedCMMS%2FShared%20Documents%2FFC%20Madras&viewid=1c6d8ce0%2D5b6a%2D4b64%2Daf67%2D465eec65c04a", brd:"15-Oct-25", wsr:"", functionalTestReport:"" },
  { account:"ENEC - CAFM", vertical:"CRE", region:"ME", phase:"UAT", rag:"Amber", status:"Active", lead:"Ashwin", consultant:"Paurnika, Riya", comments:"", plannedGoLive:"Phase 01&02 - 15-May-2026\r\n\r\nPhase 01\r\nSoft Launch - 28-Nov-2025\r\n17-Nov-2025\r\n\r\nPhase 02 -\r\nTBD\r\n18-Feb-2026\r\n18-Dec-2025\r\n05-Dec-2025", actualGoLive:"\r\nPhase 01 Soft Launch - 28-Nov-2026\r\nPhase 02 - TBA", clientPOC:"Muhammad Asim Rashid", sowPlanStart:"11-Aug-2025", sowPlanEnd:"30-Nov-2025", plannedStart:"08-Nov-2025", actualStart:"08-Nov-2025", plannedBRDSub:"18/09/25", actualBRDSub:"19/09/25", plannedBRDSignoff:"10-Feb-2025", actualBRDSignoff:"25-Nov-2025", plannedUATStart:"Phase 01 -\r\n20-Oct-2025\r\n\r\nPhase 02 -\r\n27-Nov-2025\r\n19-Nov-2025", actualUATStart:"Phase 01 - 22-Oct-2025\r\nPhase 02 - 06-Jan-2026", plannedUATSignoff:"P1 -25-Nov-2025\r\n03-Nov-2025\r\n\r\nPhase 02 - \r\n06-Feb-2025\r\n26-Nov-2025", actualUATSignoff:"P1 - 30-Dec-2025\r\nP2 - 19-Feb-2026", projectPlan:"https://app.smartsheet.com/sheets/HCqhF2cm8WfpXh87mQpHrmqpfX2jFMXWhR92VF31", msa:"TES-CON-25-003 IT Agreement ENEC -signed full.pdf", governanceFolder:"ENEC CAFM", brd:"18/09/25", wsr:"WSR", functionalTestReport:"ENEC Phase 01 UAT - SIT Cases.xlsx" },
  { account:"ENEC - QR to Survey ", vertical:"CRE", region:"ME", phase:"Configuration", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Paurnika", comments:"Project started as per the planned date. Minor delays occurred during BRD finalization due to incorporation of feedback from multiple teams and inclusion of Cybersecurity requirements. Overall project remains on track.", plannedGoLive:"16/04/2026", actualGoLive:"TBD", clientPOC:"Muhammad Asim Rashid", sowPlanStart:"08-Jan-2026", sowPlanEnd:"16-Apr-2026", plannedStart:"08-Jan-2026", actualStart:"08-Jan-2026", plannedBRDSub:"10/02/2026\r\n05/02/2026", actualBRDSub:"10-Feb-2026", plannedBRDSignoff:"23/02/2026\r\n16/02/2026", actualBRDSignoff:"27-Feb-2026", plannedUATStart:"01/04/2026", actualUATStart:"TBD", plannedUATSignoff:"15/04/2026", actualUATSignoff:"TBD", projectPlan:"https://app.smartsheet.com/sheets/qWpjV9vfRJjWW94jcC7JQ8jgJg8ChpgfqP7vCGJ1", msa:"Facilio Connected CaFM_QR to Feedback and Survey Management & FM Ops Advisor.pdf", governanceFolder:"QR Survey - Feedback & Workspace Mgmt Project", brd:"10/02/2026\r\n05/02/2026", wsr:"WSR", functionalTestReport:"" },
  { account:"ENEC - Workspace Management", vertical:"CRE", region:"ME", phase:"Requirement Gathering", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Riya", comments:"Project started as per the planned date. Requirement discussions started later as agreed with customer. Overall project remains on track.", plannedGoLive:"27/05/2026", actualGoLive:"TBD", clientPOC:"Muhammad Asim Rashid", sowPlanStart:"08-Jan-2026", sowPlanEnd:"27-May-2026", plannedStart:"08-Jan-2026", actualStart:"08-Jan-2026", plannedBRDSub:"06/03/2026\r\n27/02/2026", actualBRDSub:"06-Mar-2026", plannedBRDSignoff:"18-Mar-2026", actualBRDSignoff:"TBD", plannedUATStart:"08/05/2026", actualUATStart:"TBD", plannedUATSignoff:"21/05/2026", actualUATSignoff:"TBD", projectPlan:"https://app.smartsheet.com/sheets/gr7HCx22gPw663MmwhG8CXm97W2xgJ6W8Q4wrXc1", msa:"Facilio_WPM_Techno-Commercial Propsoal.pdf", governanceFolder:"Workspace Management", brd:"06/03/2026\r\n27/02/2026", wsr:"WSR", functionalTestReport:"" },
  { account:"Good Hands Technical Services", vertical:"IFM", region:"ME", phase:"UAT", rag:"Amber", status:"Active", lead:"Ashwin", consultant:"Paurnika, Niviya", comments:"12-Aug-2025 - Project Kick Off\r\n2-Sept-2025 - All workshop sessions completed\r\n17-Sept-2025 - BRD Submitted for Review\r\n30-Sept-2025 - BRD Feedbacks are being incorporated\r\n20-Nov-2025 - Implementation in progress", plannedGoLive:"23-Mar-2026\r\n05-Mar-2026\r\n02-Dec-2025", actualGoLive:"TBD", clientPOC:"Prashanth Kola", sowPlanStart:"01-Jul-2025", sowPlanEnd:"01-Aug-2025", plannedStart:"12-Aug-2025", actualStart:"12-Aug-2025", plannedBRDSub:"09-Sep-2025", actualBRDSub:"17/09/2025", plannedBRDSignoff:"25/09/2025", actualBRDSignoff:"03-Jan-2026", plannedUATStart:"11/06/2025", actualUATStart:"21/01/2026", plannedUATSignoff:"18-Mar-2026\r\n28-Feb-2026\r\n24-Nov-2025", actualUATSignoff:"TBD", projectPlan:"https://app.smartsheet.com/sheets/PVwM6R3HWWpwfgV2q64G7cp6QmVmpRhQ8C95p8r1", msa:"Good Hand Technical Services- SO,MSA & SOW- Fully Executed (1).pdf", governanceFolder:"Good Hands Technical Services", brd:"09-Sep-2025", wsr:"WSR - [Facilio - Good Hands Technical Services(Orville)].xlsx", functionalTestReport:"" },
  { account:"GECO - Phase 1", vertical:"IFM", region:"ME", phase:"UAT", rag:"Red", status:"Active", lead:"Ashwin", consultant:"Arun Kumar, Jeevaregai", comments:"", plannedGoLive:"30-Mar-2026\r\n12-Dec-2025\r\n", actualGoLive:"TBD", clientPOC:"Ahmad Ali Mansoor", sowPlanStart:"09-Sep-2025", sowPlanEnd:"04-May-2026", plannedStart:"09-Sep-2025", actualStart:"09-Sep-2025", plannedBRDSub:"04/03/2026\r\n27/02/2026\r\n03/12/2025\r\n02/10/2025", actualBRDSub:"04-Mar-2026", plannedBRDSignoff:"24/03/2026\r\n20/03/2026\r\n16/10/2025", actualBRDSignoff:"TBD", plannedUATStart:"24-Feb-2026 - 26-Feb-2026\r\n23-Dec-2025 - 24-Dec-2025\r\n21-Nov-2025", actualUATStart:"24-Feb-2026 - 26-Feb-2026\r\n23-Dec-2025 - 24-Dec-2025", plannedUATSignoff:"26-Mar-2026\r\n11-Dec-2025", actualUATSignoff:"TBD", projectPlan:"https://app.smartsheet.com/sheets/fcmWhmWGqpVQRfWfM245M7p3cjq7Hrq77r7WwgC1", msa:"GECO-End User License Agreement (EULA)-Fully Executed.pdf", governanceFolder:"GECO", brd:"04/03/2026\r\n27/02/2026\r\n03/12/2025\r\n02/10/2025", wsr:"WSR", functionalTestReport:"" },
  { account:"GECO - Phase 2", vertical:"IFM", region:"ME", phase:"Requirement Gathering", rag:"Red", status:"Active", lead:"Ashwin", consultant:"Arun Kumar, Jeevaregai", comments:"", plannedGoLive:"26/05/2026", actualGoLive:"TBD", clientPOC:"Ahmad Ali Mansoor", sowPlanStart:"09-Sep-2025", sowPlanEnd:"04-May-2026", plannedStart:"09-Sep-2025", actualStart:"09-Sep-2025", plannedBRDSub:"11/03/2026\r\n02/10/2025", actualBRDSub:"13-Mar-2026", plannedBRDSignoff:"31/03/2025\r\n16/10/2025", actualBRDSignoff:"TBD", plannedUATStart:"28/04/2026", actualUATStart:"TBD", plannedUATSignoff:"18/05/2026", actualUATSignoff:"TBD", projectPlan:"https://app.smartsheet.com/sheets/fcmWhmWGqpVQRfWfM245M7p3cjq7Hrq77r7WwgC1", msa:"GECO-End User License Agreement (EULA)-Fully Executed.pdf", governanceFolder:"GECO", brd:"11/03/2026\r\n02/10/2025", wsr:"WSR", functionalTestReport:"" },
  { account:"Ghassan - GAG", vertical:"CRE", region:"ME", phase:"Transitioned to support", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Hari,Jeevaregai", comments:"Project Progressing with noted Risk, Due to internal resourcing issue. ", plannedGoLive:"11/12/2025", actualGoLive:"18/12/2025", clientPOC:"1E+13", sowPlanStart:"18-Jun-2025", sowPlanEnd:"17-Dec-2025", plannedStart:"30-Jul-2025", actualStart:"14-Aug-2025", plannedBRDSub:"24-Sep-2025", actualBRDSub:"25-Sep-2025", plannedBRDSignoff:"01-Oct-2025", actualBRDSignoff:"14-Oct-2025", plannedUATStart:"24/11/2025", actualUATStart:"19/11/2025", plannedUATSignoff:"09/12/2025", actualUATSignoff:"18/12/2025", projectPlan:"ProjectPlan_Corp_CAFM_Ver3_GAG_Facilio_FullRollout_PDF.pdf", msa:"Ghassan Aboud Group - Facilio_SO MSA SOW_Signed Version.pdf", governanceFolder:"Ghassan Aboud Group - Facilio_SO MSA SOW_Signed Version.pdf", brd:"24-Sep-2025", wsr:"GAG - WSR.pptx", functionalTestReport:"" },
  { account:"Laith Electro Mechanical", vertical:"IFM", region:"ME", phase:"UAT", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Paurnika, Niviya", comments:"Project in progress as planned - will be completed before the planned date", plannedGoLive:"14/04/2026", actualGoLive:"TBD", clientPOC:"Nael Suleiman", sowPlanStart:"10-Jan-2025", sowPlanEnd:"27-Oct-2025", plannedStart:"06-Nov-2025", actualStart:"06-Nov-2025", plannedBRDSub:"15-Dec-2025", actualBRDSub:"18-Dec-2025", plannedBRDSignoff:"02-Jan-2026", actualBRDSignoff:"30-Dec-2025", plannedUATStart:"18-Mar-2026\r\n09-Mar-2026\r\n03-Mar-2026\r\n20-Mar-2026", actualUATStart:"TBD", plannedUATSignoff:"08/04/2026", actualUATSignoff:"TBD", projectPlan:"https://app.smartsheet.com/sheets/264cV7m8Mh3fcHggh523WMhpfC9VPWqr8CmvJ241", msa:"Laith Electro Mechanical - MSA, SOW.pdf", governanceFolder:"Laith", brd:"15-Dec-2025", wsr:"WSR", functionalTestReport:"" },
  { account:"HG Facilities Solutions - wave 2'", vertical:"IFM", region:"US", phase:"Transitioned to support", rag:"Green", status:"Full Scope Dleivered and Fully Live", lead:"Deepak Simon", consultant:"Muthu, Hasina", comments:"16-Dec-2025 - Workshop completed\r\n19-Dec-2025 - BRD Submitted\r\n5-Jan-2026 - BRD Approval\r\n6-Jan-2026 - UAT\r\n13-Jan-2026 - Go Live\r\n", plannedGoLive:"2-Mar-2026", actualGoLive:"13-Jan-2026", clientPOC:"Ryan McDonagh, Nicole Vernazzaro", sowPlanStart:"16-Oct-2025", sowPlanEnd:"26-Mar-2026", plannedStart:"11-Dec-2025", actualStart:"16-Dec-2025", plannedBRDSub:"24-Dec-2025\r\n19-Dec-2025\r\n", actualBRDSub:"19-Dec-2025", plannedBRDSignoff:"5-Jan-2026", actualBRDSignoff:"6-Jan-2026", plannedUATStart:"16-Feb-2026", actualUATStart:"7-Jan-2026", plannedUATSignoff:"25-Feb-2026", actualUATSignoff:"12-Jan-2026", projectPlan:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/ET_SvOerWA9OsKVBT8Bl-TABVzE0mKeA_O17gehePnq-cQ?e=qyA22n", msa:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/ET_SvOerWA9OsKVBT8Bl-TABVzE0mKeA_O17gehePnq-cQ?e=qyA22n", governanceFolder:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/EuYbNSUKu7lFgQo_9-fNkFgB8DO3BW6BIII70xjO0GR9_A?e=ueIvxp", brd:"24-Dec-2025\r\n19-Dec-2025\r\n", wsr:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/Eccp_SEZpzBOkJQzxbI0GgcBeomFD_c7XvdQwmsHqBVTzg?e=RvopLY", functionalTestReport:"" },
  { account:"Dunnes Stores", vertical:"IFM", region:"UK", phase:"Configuration", rag:"Green", status:"Active", lead:"Deepak Simon", consultant:"Muthu", comments:"7-Jan-2026 - Kick off\r\n12-Jan-2026 - Requirement Gathering session 1\r\n14-Jan-2026 - Requirement Gathering session 2\r\n19-Jan-2026 - Requirement Gathering session 3\r\n28-Jan-2026 - Requirement Gathering session 4\r\n04-Feb-2026 - BRD submitted for Portfolio, Assets, Vendor\r\n09-Feb-2026 - BRD submitted for WO, PPM & Inspection\r\n2-Mar-2026 - Offical BRD Signed off", plannedGoLive:"06 July 2026", actualGoLive:"", clientPOC:"Tony Gaynor & Stephen Igoe", sowPlanStart:"5-Jan-2026", sowPlanEnd:"6-Aug-2026", plannedStart:"5-Jan-2026", actualStart:"7-Jan-2026", plannedBRDSub:"21-Jan-2026\r\n4-Feb-2026\r\n9-Feb-2026", actualBRDSub:"9-Feb-2026", plannedBRDSignoff:"27-Jan-2026\r\n11-Feb-2026\r\n19-Feb-2026\r\n2-Mar-2026", actualBRDSignoff:"2-Mar-2026", plannedUATStart:"25-May-2026", actualUATStart:"", plannedUATSignoff:"5-Jun-2026", actualUATSignoff:"", projectPlan:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/IQACgYGV8YL2RKLvwTgS_LrkAWArImoGPKajtrdnI6x5Fkc?e=F0I3p2", msa:"https://facilio958-my.sharepoint.com/:b:/g/personal/shivaraj_facilio_com/IQCt4o8A_kyFSb4IuEGTr5naASMb_2dwBZ5WJjd3exmOJOA?e=1iH0af", governanceFolder:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/IgBtBfCSa2TnSZmV1Spk2YarAQBUKDyzkUdUY-X3ceohHb0?e=pSCTJV", brd:"21-Jan-2026\r\n4-Feb-2026\r\n9-Feb-2026", wsr:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/IQACgYGV8YL2RKLvwTgS_LrkAWArImoGPKajtrdnI6x5Fkc?e=vJxi1j", functionalTestReport:"" },
  { account:"Unilodge Single Family Housing", vertical:"CRE", region:"AUS", phase:"UAT", rag:"Green", status:"Active", lead:"Deepak Simon", consultant:"Hasina J", comments:"3-Feb-2026 - Kick Off\r\n4-Feb-2026 - Requirement Gathering (Portfolio, Asset, Vendor)\r\n6-Feb-2026 - Requirement Gathering (WO, Planned Maintenance, Quote, RFQ, Invoice, AI process flow\r\n10-Feb-2026 - Integration discussion\r\n13-Feb-2026 - Final clarification on DOA\r\n24-Feb-2026 - BRD submitted for Review\r\n17-Apr-2026 - UAT Session 1 handover", plannedGoLive:"27-Apr-2026\r\n6-May-2026", actualGoLive:"", clientPOC:"Scott Nicholas", sowPlanStart:"8-Dec-2025", sowPlanEnd:"18-Feb-2026", plannedStart:"2-Feb-2026", actualStart:"2-Feb-2026", plannedBRDSub:"11-Feb-2026\r\n19-Feb-2026\r\n23-Feb-2026", actualBRDSub:"23-Feb-2026", plannedBRDSignoff:"13-Feb-2026\r\n26-Feb-2026\r\n6-Mar-2026\r\n9-Mar-2026", actualBRDSignoff:"9-Mar-2026", plannedUATStart:"25-Mar-2026\r\n31-Mar-2026\r\n17-Apr-2026", actualUATStart:"17-Apr-2026", plannedUATSignoff:"7-Apr-2026\r\n30-Apr-2026", actualUATSignoff:"", projectPlan:"https://facilio958-my.sharepoint.com/:i:/g/personal/shivaraj_facilio_com/IQBSLiDSKmHhSJgvnVk2wctXAXYpSPEhXCCWw8Yz4ukTt2E?e=oLhSbj", msa:"https://facilio958-my.sharepoint.com/:b:/g/personal/shivaraj_facilio_com/IQCasYWYj0oyRrd_Q0gJEZQ1AQtPOqsozM18NxYUupu_aro?e=lugoIb", governanceFolder:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/IgArD_NK3rU2RbfMqCaWWzWhAZS2_5oVwpXp8dfnV4lIzWU?e=waYL6e", brd:"11-Feb-2026\r\n19-Feb-2026\r\n23-Feb-2026", wsr:"https://facilio958-my.sharepoint.com/:x:/g/personal/shivaraj_facilio_com/IQBiKPbc55kkQpZxiYpSwfeGASogJ47jo7NQjxLODRERrRg?e=SxRJon", functionalTestReport:"Unilodge_SFH_WO_Functional_Test_Cases.xlsx" },
  { account:"International Motors", vertical:"IFM", region:"US", phase:"UAT", rag:"Green", status:"Active", lead:"Deepak Simon", consultant:"Muthu", comments:"", plannedGoLive:"15-Apr-2026\r\n15-May-2026", actualGoLive:"", clientPOC:"Suchismita Bose", sowPlanStart:"3-Nov-2025", sowPlanEnd:"15-Apr-2026", plannedStart:"9-Dec-2025", actualStart:"", plannedBRDSub:"19-Jan-2026\r\n23-Jan-2026\r\n28-Jan-2026", actualBRDSub:"28-Jan-2026", plannedBRDSignoff:"23-Jan-2026\r\n28-Jan-2026", actualBRDSignoff:"28-Jan-2026", plannedUATStart:"2-Mar-2026", actualUATStart:"2-Mar-2026", plannedUATSignoff:"31-Mar-2026", actualUATSignoff:"", projectPlan:"", msa:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/IgBnVRBoJ1ULQoxFaVrJRwlfAR06OOT-LvFwFl50h5-3OdI?e=CjqLCw", governanceFolder:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/IgAU57uDcseURbPtGwJ4T-VZAR46Ki2wqTEDDLMvF1CvNhM?e=5yps78", brd:"19-Jan-2026\r\n23-Jan-2026\r\n28-Jan-2026", wsr:"", functionalTestReport:"" },
  { account:"Publix US", vertical:"IFM", region:"US", phase:"UAT", rag:"Green", status:"Active", lead:"Deepak Simon", consultant:"Muthu", comments:"23-Jan-2026 - Actual go live will be confirmed when all issues are sorted, \r\nOne of the vendors to be trained last week of Feb & use the system for 2 to 3 weeks. So the go live will be mid of march.\r\nGo Live - 6-April-2026", plannedGoLive:"5-Jan-2026\r\n16-Feb-2026\r\n3-Mar-2026\r\n14-Apr-2026\r\n15-May-2026", actualGoLive:"", clientPOC:"Mitchell.Francois@publix.com", sowPlanStart:"1-Sep-2025", sowPlanEnd:"19-Jan-2026", plannedStart:"1-Sep-2025", actualStart:"14-Oct-2025", plannedBRDSub:"17-Oct-2025", actualBRDSub:"22-Oct-2025", plannedBRDSignoff:"24-Oct-2025", actualBRDSignoff:"14-Nov-2025", plannedUATStart:"8-Dec-2025\r\n5-Jan-2026", actualUATStart:"5-Jan-2026", plannedUATSignoff:"26-Dec-2025", actualUATSignoff:"", projectPlan:"https://app.smartsheet.com/sheets/3j57jqq3J3FH3VGR8Qj4mJ2VMFrwvvM7cGmWmvR1", msa:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/IgD1k0V5bQ1OT7oVRPPA5LjmAdVWz8xVGFJijAPuSDGTBM4?e=xM5K2v", governanceFolder:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/IgCpDthkFqY7Q4c32iWSt2TvAVnGKYw-_qMPd8z_pi31V9M?e=FoGmZV", brd:"17-Oct-2025", wsr:"", functionalTestReport:"" },
  { account:"T.J Regional Health", vertical:"IFM", region:"US", phase:"UAT", rag:"Green", status:"Active", lead:"Deepak Simon", consultant:"Hasina J", comments:"All Planned Dates are from MSA dates. \r\n10-Feb-2026 - Kick off Started\r\n11-Feb-2026 - Worshop 1 - Portfolio & Asset\r\n16-Feb-2026 - Workshop 2 - Service Request, Reactive & inventory\r\n18-Feb-2026 - Workshop 3 moved by customer\r\n20-Feb-2026 - Workshop 3 - Inspection & Planned Maintenance\r\n4-Mar-2026 - BRD submitted\r\n9-Mar-2026 - BRD Approved\r\n12-Mar-2026 - UAT & Access provided", plannedGoLive:"4-May-2026", actualGoLive:"", clientPOC:"Chad Friend", sowPlanStart:"19-Jan-2026", sowPlanEnd:"28-Apr-2026", plannedStart:"19-Jan-2026\r\n10-Feb-2026", actualStart:"10-Feb-2026", plannedBRDSub:"26-Jan-2026\r\n26-Feb-2026", actualBRDSub:"4-Mar-2026", plannedBRDSignoff:"29-Jan-2026\r\n3-Mar-2026\r\n6-Mar-2026\r\n10-Mar-2026", actualBRDSignoff:"10-Mar-2026", plannedUATStart:"24-Mar-2026\r\n10-Mar-2026\r\n11-Mar-2026", actualUATStart:"11-Mar-2026", plannedUATSignoff:"2-Apr-2026", actualUATSignoff:"", projectPlan:"https://facilio958-my.sharepoint.com/:f:/g/personal/shivaraj_facilio_com/IgDkYAaeZG_SSoVqQw5ByqT4AQjHJ_neKlBTQ-jAyQtF5RI?e=lIUmjH", msa:"https://facilio958-my.sharepoint.com/:b:/g/personal/shivaraj_facilio_com/IQBsIDbNAMWVQIVtX-TmQ4GMAVZIExC4c4pw7Ynm_P7M4ak?e=pxUu5z", governanceFolder:"01_Project Governance", brd:"26-Jan-2026\r\n26-Feb-2026", wsr:"", functionalTestReport:"" },
  { account:"Dimeo", vertical:"IFM", region:"AUS", phase:"Configuration", rag:"Green", status:"Active", lead:"Vandhana", consultant:"", comments:"27-01-2026 - Kick off Completed\r\n13-02-2026 - Workshops completed, however we still may have one quick session for contracts as we have't got the sample data yet", plannedGoLive:"9-Apr-2026", actualGoLive:"", clientPOC:"David Marsh & Paul Brown", sowPlanStart:"12-Jan-26", sowPlanEnd:"24-Mar-26", plannedStart:"27-Jan-26", actualStart:"27-Jan-26", plannedBRDSub:"2-Feb-26", actualBRDSub:"", plannedBRDSignoff:"5-Feb-26", actualBRDSignoff:"", plannedUATStart:"12-Mar-26", actualUATStart:"", plannedUATSignoff:"30-Mar-26", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"2-Feb-26", wsr:"", functionalTestReport:"" },
  { account:"Scouts NSW - Phase 1", vertical:"CRE", region:"AUS", phase:"Hypercare", rag:"Green", status:"Active", lead:"Deepak Simon", consultant:"Deepak", comments:"", plannedGoLive:"14-Oct-2025", actualGoLive:"20-Nov-2025", clientPOC:"Nicholas Sheehan", sowPlanStart:"", sowPlanEnd:"", plannedStart:"16-Jul-2025", actualStart:"16-Jul-2025", plannedBRDSub:"6-Aug-2025", actualBRDSub:"13-Aug-2025", plannedBRDSignoff:"15-Aug-2025", actualBRDSignoff:"2-Sep-2025", plannedUATStart:"24-Sep-2025", actualUATStart:"24-Sep-2025", plannedUATSignoff:"9-Oct-2025", actualUATSignoff:"13-Oct-2025", projectPlan:"", msa:"", governanceFolder:"", brd:"6-Aug-2025", wsr:"", functionalTestReport:"" },
  { account:"Scouts NSW - Phase 2", vertical:"CRE", region:"AUS", phase:"UAT", rag:"Amber", status:"Active", lead:"Deepak Simon", consultant:"Deepak", comments:"", plannedGoLive:"", actualGoLive:"", clientPOC:"Nicholas Sheehan", sowPlanStart:"", sowPlanEnd:"", plannedStart:"16-Jul-2025", actualStart:"16-Jul-2025", plannedBRDSub:"", actualBRDSub:"", plannedBRDSignoff:"", actualBRDSignoff:"", plannedUATStart:"", actualUATStart:"", plannedUATSignoff:"", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"", wsr:"", functionalTestReport:"" },
  { account:"OSUS - Phase 1", vertical:"CRE", region:"ME", phase:"Configuration", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Dinesh", comments:"Customer asked to deliver the project by April 1-15th\r\nProject Started and progressing as per plan", plannedGoLive:"02/04/2026", actualGoLive:"TBD", clientPOC:"Ahmed Saber", sowPlanStart:"22-Jan-2026", sowPlanEnd:"24-May-2026", plannedStart:"22-Jan-2026", actualStart:"22-Jan-2026", plannedBRDSub:"23-Feb-2026", actualBRDSub:"24-Feb-2026", plannedBRDSignoff:"06/03/2026\r\n04/03/2026", actualBRDSignoff:"08-Mar-2026", plannedUATStart:"25/03/2026", actualUATStart:"TBD", plannedUATSignoff:"01/04/2026", actualUATSignoff:"TBD", projectPlan:"https://app.smartsheet.com/sheets/q2rJFfh49r8GjPmgqxCrM5MmchrpGMX34HR4q551", msa:"Osus_SO,MSA,SOW_Fully Executed_20.pdf", governanceFolder:"OSUS", brd:"23-Feb-2026", wsr:"WSR", functionalTestReport:"" },
  { account:"OSUS - Phase 2", vertical:"CRE", region:"ME", phase:"Configuration", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Dinesh", comments:"", plannedGoLive:"24/05/2026", actualGoLive:"TBD", clientPOC:"Ahmed Saber", sowPlanStart:"22-Jan-2026", sowPlanEnd:"24-May-2026", plannedStart:"22-Jan-2026", actualStart:"22-Jan-2026", plannedBRDSub:"23-Feb-2026", actualBRDSub:"24-Feb-2026", plannedBRDSignoff:"06/03/2026\r\n04/03/2026", actualBRDSignoff:"TBD", plannedUATStart:"11/05/2026", actualUATStart:"TBD", plannedUATSignoff:"19/05/2026", actualUATSignoff:"TBD", projectPlan:"https://app.smartsheet.com/sheets/q2rJFfh49r8GjPmgqxCrM5MmchrpGMX34HR4q551", msa:"Osus_SO,MSA,SOW_Fully Executed_20.pdf", governanceFolder:"OSUS", brd:"23-Feb-2026", wsr:"WSR", functionalTestReport:"" },
  { account:"ES Global", vertical:"IFM", region:"ME", phase:"Requirement Gathering", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Meeran, Arun", comments:"Planned to standardise the BRD, Requirement Gathering and Implementation approach for this account - as it is below 20k account\r\nProject Started and progressing as per plan", plannedGoLive:"21/05/2026", actualGoLive:"TBD", clientPOC:"John Mathew", sowPlanStart:"19-Feb-2026", sowPlanEnd:"21-May-2026", plannedStart:"19-Feb-2026", actualStart:"19-Feb-2026", plannedBRDSub:"03-Mar-2026", actualBRDSub:"04-Mar-2026", plannedBRDSignoff:"13-Mar-2026", actualBRDSignoff:"TBD", plannedUATStart:"04/05/2026", actualUATStart:"TBD", plannedUATSignoff:"15/05/2026", actualUATSignoff:"TBD", projectPlan:"https://app.smartsheet.com/sheets/7pcRJ2qwX7MP2mRrFGq5QGwHMX4XfRcR3876C351", msa:"ES Global_SO, MSA,SOW_Fully executed.pdf", governanceFolder:"ES Global Manpower LLC", brd:"03-Mar-2026", wsr:"WSR", functionalTestReport:"" },
  { account:"CIT - Diriya", vertical:"IFM", region:"ME", phase:"Configuration", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Dinesh", comments:"", plannedGoLive:"", actualGoLive:"", clientPOC:"Nitish Soondur", sowPlanStart:"", sowPlanEnd:"", plannedStart:"", actualStart:"", plannedBRDSub:"", actualBRDSub:"", plannedBRDSignoff:"", actualBRDSignoff:"", plannedUATStart:"", actualUATStart:"", plannedUATSignoff:"", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"", wsr:"", functionalTestReport:"" },
  { account:"Teyseer", vertical:"IFM", region:"ME", phase:"Configuration", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Arun, Jeeva", comments:"", plannedGoLive:"11/06/2026", actualGoLive:"", clientPOC:"Dominico", sowPlanStart:"11-Mar-2026", sowPlanEnd:"08-Sep-2026", plannedStart:"11-Mar-2026", actualStart:"11-Mar-2026", plannedBRDSub:"02-Apr-2026", actualBRDSub:"", plannedBRDSignoff:"17-Apr-2026", actualBRDSignoff:"14-Apr-2026", plannedUATStart:"21/05/2026", actualUATStart:"", plannedUATSignoff:"03/06/2026", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"02-Apr-2026", wsr:"", functionalTestReport:"" },
  { account:"Modon - Phase 1", vertical:"CRE", region:"ME", phase:"Requirement Gathering", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Paurnika, Riya, Jhimlee", comments:"", plannedGoLive:"02/09/2026", actualGoLive:"", clientPOC:"Firas Abdul Rahman", sowPlanStart:"17-Mar-2026", sowPlanEnd:"", plannedStart:"17-Mar-2026", actualStart:"17-Mar-2026", plannedBRDSub:"28-Apr-2026", actualBRDSub:"", plannedBRDSignoff:"11-May-2026", actualBRDSignoff:"", plannedUATStart:"03/08/2026", actualUATStart:"", plannedUATSignoff:"26/08/2026", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"28-Apr-2026", wsr:"", functionalTestReport:"" },
  { account:"Modon - Phase 2", vertical:"CRE", region:"ME", phase:"Requirement Gathering", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Paurnika, Riya, Jhimlee", comments:"", plannedGoLive:"", actualGoLive:"", clientPOC:"", sowPlanStart:"", sowPlanEnd:"", plannedStart:"", actualStart:"", plannedBRDSub:"", actualBRDSub:"", plannedBRDSignoff:"", actualBRDSignoff:"", plannedUATStart:"", actualUATStart:"", plannedUATSignoff:"", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"", wsr:"", functionalTestReport:"" },
  { account:"Modon - Phase 3", vertical:"CRE", region:"ME", phase:"Requirement Gathering", rag:"Green", status:"Active", lead:"Ashwin", consultant:"Paurnika, Riya, Jhimlee", comments:"", plannedGoLive:"", actualGoLive:"", clientPOC:"", sowPlanStart:"", sowPlanEnd:"", plannedStart:"", actualStart:"", plannedBRDSub:"", actualBRDSub:"", plannedBRDSignoff:"", actualBRDSignoff:"", plannedUATStart:"", actualUATStart:"", plannedUATSignoff:"", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"", wsr:"", functionalTestReport:"" },
  { account:"TSL", vertical:"IFM", region:"UK", phase:"Requirement Gathering", rag:"Green", status:"Active", lead:"Deepak Simon", consultant:"", comments:"18-March-2026 - Kick off\r\n23-March-2026 - BRD Workshop\r\n30-March-2026 - BRD Submitted\r\n1-April-2026 - BRD Approved", plannedGoLive:"8-June-2026​", actualGoLive:"", clientPOC:"Phil Buxton​", sowPlanStart:"19-Feb-2026", sowPlanEnd:"19-May-2026", plannedStart:"18-Mar-2026", actualStart:"18-Mar-2026", plannedBRDSub:"31-March-2026​", actualBRDSub:"31-March-2026​", plannedBRDSignoff:"8-April-2026​", actualBRDSignoff:"1-April-2026​", plannedUATStart:"28-May-2026​", actualUATStart:"", plannedUATSignoff:"4-June-2026​", actualUATSignoff:"", projectPlan:"Inital Project Plan", msa:"MSA", governanceFolder:"TSL UK", brd:"31-March-2026​", wsr:"", functionalTestReport:"" },
  { account:"Houchens", vertical:"IFM", region:"US", phase:"Configuration", rag:"Green", status:"Active", lead:"Deepak Simon", consultant:"", comments:"", plannedGoLive:"", actualGoLive:"", clientPOC:"Anne Sullivan & Keith Martin", sowPlanStart:"", sowPlanEnd:"", plannedStart:"16-Feb-2026", actualStart:"16-Feb-2026", plannedBRDSub:"23-Feb-2026\r\n25-Feb-2026", actualBRDSub:"25-Feb-2026", plannedBRDSignoff:"3-Mar-2026", actualBRDSignoff:"3-Mar-2026", plannedUATStart:"15-Apr-2026", actualUATStart:"", plannedUATSignoff:"18-May-2026", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"23-Feb-2026\r\n25-Feb-2026", wsr:"", functionalTestReport:"" },
  { account:"Daylesford - Phase 1", vertical:"IFM", region:"UK", phase:"Configuration", rag:"Green", status:"Active", lead:"Deepak Simon", consultant:"Thilak", comments:"Workshop started on 14-Jan-2026 & ended on 6-Mar-2026\r\nBRD Signed off - 31-Mar-2026", plannedGoLive:"20-Apr-2026\r\n5-Jun-2026", actualGoLive:"", clientPOC:"", sowPlanStart:"5-Jan-2026", sowPlanEnd:"21-Apr-2026", plannedStart:"5-Jan-2026\r\n14-Jan-2026", actualStart:"14-Jan-2026", plannedBRDSub:"15-Jan-2026\r\n20-Mar-2026", actualBRDSub:"20-Mar-2026", plannedBRDSignoff:"22-Jan-2026\r\n20-Mar-2026\r\n31-Mar-2026", actualBRDSignoff:"31-Mar-2026", plannedUATStart:"7-Apr-2026\r\n22-Apr-2026", actualUATStart:"", plannedUATSignoff:"16-Apr-2026\r\n6-May-2026", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"15-Jan-2026\r\n20-Mar-2026", wsr:"", functionalTestReport:"" },
  { account:"Daylesford - Phase 2", vertical:"IFM", region:"UK", phase:"Configuration", rag:"Green", status:"Active", lead:"Deepak Simon", consultant:"Thilak", comments:"Workshop started on 14-Jan-2026 & ended on 6-Mar-2026\r\nBRD Signed off - 31-Mar-2026", plannedGoLive:"20-Apr-2026\r\n5-Jun-2026", actualGoLive:"", clientPOC:"", sowPlanStart:"5-Jan-2026", sowPlanEnd:"21-Apr-2026", plannedStart:"5-Jan-2026\r\n14-Jan-2026", actualStart:"14-Jan-2026", plannedBRDSub:"15-Jan-2026\r\n20-Mar-2026", actualBRDSub:"20-Mar-2026", plannedBRDSignoff:"22-Jan-2026\r\n20-Mar-2026\r\n31-Mar-2026", actualBRDSignoff:"31-Mar-2026", plannedUATStart:"7-Apr-2026\r\n19-May-2026", actualUATStart:"", plannedUATSignoff:"16-Apr-2026\r\n27-May-2026", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"15-Jan-2026\r\n20-Mar-2026", wsr:"", functionalTestReport:"" },
  { account:"UK Lift - Phase 1 - Pilot", vertical:"IFM", region:"UK", phase:"UAT", rag:"Amber", status:"Active", lead:"Deepak Simon", consultant:"Shasvat", comments:"UAT Delays\r\nMarch 23 – UKLE requested additional time. An extension was agreed and confirmed by UKLE.\r\nMarch 25 – Ian’s site visit at UKLE,  identified additional changes to be addressed\r\nMarch 27 –  UAT planned sign-off date \r\nApril 1 – All identified changes were completed. UKLE was requested to test and provide approval\r\nEarly April – UKLE - Easter holiday \r\nApril 8 – UKLE has requested a further 2-week extension, citing Shaun’s unavailability until April 13–14\r\n\r\nEarly April – UKLE - Easter holiday \r\n\r\nApril 1 – All identified changes were completed. UKLE was requested to test and provide approval\r\n\r\nMarch 27 –  UAT planned sign-off date \r\n\r\nMarch 25 – Ian’s site visit at UKLE,  identified additional changes to be addressed\r\n\r\nMarch 23 – UKLE requested additional time. An extension was agreed and confirmed by UKLE.\r\n\r\nMar 9th - UAT still underway as client was unavailable to test - extended as per client request\r\n-------\r\nFeb 23rd 2026,\r\n - UAT has been initiated \r\nFeb 17th 2026,\r\n- Phase 1 UAT Given\r\nFeb 13th 2026,\r\n - UAT has been scheduled on Feb 17th as per customer availability, Final testing and fixes are being carried out in preparation of UAT\r\n\r\nFeb 11th 2026,\r\n - UAT have been pushed to Feb 16th and got confirmation from customer as well, and the push is due to the Requirement to Product mapping challenges since we are implementing on FSM \r\n\r\nJan 23rd 2026,\r\n - Implementation is in Progress", plannedGoLive:"20-Mar-2026\r\n1-May-2026", actualGoLive:"", clientPOC:"", sowPlanStart:"3-Nov-2025", sowPlanEnd:"30-Mar-2026", plannedStart:"3-Nov-2025\r\n14-Nov-2025", actualStart:"14-Nov-2025", plannedBRDSub:"17-Nov-2025\r\n29-Dec-2025", actualBRDSub:"29-Dec-2025", plannedBRDSignoff:"19-Nov-2025\r\n7-Jan-2026", actualBRDSignoff:"7-Jan-2026", plannedUATStart:"18-Feb-2026\r\n10-Feb-2026\r\n24-Feb-2026", actualUATStart:"24-Feb-2026\r\n", plannedUATSignoff:"3-Mar-2026\r\n2-Mar-2026\r\n30-Mar-2026\r\n8-Apr-2026\r\n22-Apr-2026", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"17-Nov-2025\r\n29-Dec-2025", wsr:"WSR - UK L&E.xlsx", functionalTestReport:"" },
  { account:"UK Lift - Phase 2 - Pilot", vertical:"IFM", region:"UK", phase:"Configuration", rag:"Amber", status:"Active", lead:"Deepak Simon", consultant:"Shasvat", comments:"Mar 9th - \r\n\r\nBRD has been approved on 6th march\r\nWireframe was demonstrated -- feedback has been recieved and is under internal discussion (including presales)\r\n--------\r\nFeb 23rd 2026,\r\n - BRD Approval expected to be completed by Feb 23rd 2026\r\n\r\nFeb 13th 2026,\r\n - BRD was submitted last week and the customer provided some feedback and is estimated to be completed by this week\r\n - Implementation of the Phase-2 items would be handled by Product directly, Ian have included in an email with Krishna and Yoge that would provide more info\r\n\r\nJan 23rd 2026,\r\n - Back and Forth with product and customer to finalize the Rate Cards Model that is delaying the BRD\r\n - Awaiting confirmation on a query from customer, post that will finalize the requirements and align the BRD", plannedGoLive:"20-Mar-2026\r\n1-May-2026", actualGoLive:"", clientPOC:"", sowPlanStart:"3-Nov-2025", sowPlanEnd:"30-Mar-2026", plannedStart:"3-Nov-2025\r\n8-Jan-2026", actualStart:"8-Jan-2026", plannedBRDSub:"17-Nov-2025\r\n11-Feb-2026\r\n13-Feb-2026", actualBRDSub:"13-Feb-2026", plannedBRDSignoff:"19-Nov-2025\r\n20-Feb-2026\r\n6-Mar-2026", actualBRDSignoff:"6-Mar-2026", plannedUATStart:"18-Feb-2026\r\n10-Apr-2026\r\n13-Apr-2026\r\n27-April-2026\r\n5-May-2026", actualUATStart:"", plannedUATSignoff:"9-Mar-2026\r\n24-Apr-2026\r\n30-Apr-2026", actualUATSignoff:"", projectPlan:"", msa:"", governanceFolder:"", brd:"17-Nov-2025\r\n11-Feb-2026\r\n13-Feb-2026", wsr:"WSR - UK L&E.xlsx", functionalTestReport:"" },
  { account:"KSD Group", vertical:"IFM", region:"UK", phase:"Requirement Gathering", rag:"Amber", status:"Active", lead:"Deepak Simon", consultant:"Shasvat", comments:"Kick off - 26-March-2026\r\nWorkshop 1 - 31-March-2026\r\nWorkshop 2 - 1-April-2026\r\nWorkshop 3 - 7-April-2026\r\nWorkshop 4 - 9-April-2026\r\nWorkshop 5 - Technicial Integration Discussion (No ETA Agreed)", plannedGoLive:"24-Sep-2026", actualGoLive:"", clientPOC:"", sowPlanStart:"9-Mar-2026", sowPlanEnd:"24-Sep-2026", plannedStart:"26-Mar-2026", actualStart:"26-Mar-2026", plannedBRDSub:"26-Mar-2026", actualBRDSub:"", plannedBRDSignoff:"31-Mar-2026", actualBRDSignoff:"", plannedUATStart:"28-Aug-2026", actualUATStart:"", plannedUATSignoff:"16-Sep-2026", actualUATSignoff:"", projectPlan:"Updated Project plan", msa:"KSD_SO, MSA, SOW_19 March 2026.docx.pdf", governanceFolder:"KSD", brd:"26-Mar-2026", wsr:"", functionalTestReport:"" }
];

const PHASES = ["Requirement Gathering", "Configuration", "UAT", "Hypercare", "Transitioned to support"];

const PHASE_META = {
  "Requirement Gathering": { color:"#64748b", bg:"#64748b18" },
  "Configuration":         { color:"#d97706", bg:"#f59e0b18" },
  "UAT":                   { color:"#059669", bg:"#22c55e18" },
  "Hypercare":             { color:"#ea580c", bg:"#f9731618" },
  "Transitioned to support": { color:"#7c3aed", bg:"#8b5cf618" }
};

const RAG_META = {
  "Green": { color:"#059669", bg:"#22c55e18" },
  "Amber": { color:"#d97706", bg:"#f59e0b18" },
  "Red":   { color:"#dc2626", bg:"#ef444418" }
};

const TWELVE_HRS = 12 * 60 * 60 * 1000;

const VertPill = ({ v }) => {
  const meta = { "CMMS": { color:"#0d9488", bg:"#0d948818" }, "EAM": { color:"#2563eb", bg:"#2563eb18" }, "Other": { color:"#64748b", bg:"#64748b18" } };
  const m = meta[v] || meta.Other;
  return <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:10, color:m.color, background:m.bg }}>{v||"—"}</span>;
};

const PhasePill = ({ phase }) => {
  const m = PHASE_META[phase] || { color:"#64748b", bg:"#64748b18" };
  return <span style={{ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:10, color:m.color, background:m.bg }}>{phase||"—"}</span>;
};

const RAGDot = ({ rag }) => {
  const m = RAG_META[rag] || RAG_META.Green;
  return <span style={{ width:7, height:7, borderRadius:4, background:m.color, display:"inline-block" }}></span>;
};

const fmtTime = (ts) => {
  const d = new Date(ts);
  return d.toLocaleString();
};

const normalizeHeader = (value) =>
  String(value || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const RUNWAY_PHASE_LABELS = {
  "Requirement Gathering": "Requirement Gathering",
  "Configuration": "Configuration",
  "UAT": "UAT",
  "Hypercare": "Hypercare",
  "Transitioned to support": "Transitioned to support"
};

const parseDate = (value) => {
  if (!value) return null;
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number") {
    const serial = XLSX.SSF.parse_date_code(value);
    if (serial) return new Date(serial.y, serial.m - 1, serial.d);
  }
  const raw = String(value).trim();
  if (!raw || raw === "—") return null;

  // SharePoint exports are typically day-first, so prefer explicit dd/mm/yyyy parsing
  // before falling back to the browser's locale-sensitive Date parser.
  const slash = raw.match(/^(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})(?:,\s*\d{1,2}:\d{2}(?::\d{2})?)?$/);
  if (slash) {
    const day = Number(slash[1]);
    const month = Number(slash[2]) - 1;
    const year = Number(slash[3].length === 2 ? `20${slash[3]}` : slash[3]);
    const parsed = new Date(year, month, day);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }

  const direct = new Date(raw);
  if (!Number.isNaN(direct.getTime())) return direct;

  return null;
};

const fmtDate = (value) => {
  const d = parseDate(value);
  return d
    ? d.toLocaleDateString("en-GB", { day:"2-digit", month:"short", year:"2-digit" })
    : "—";
};

const runwayPhaseColor = (phase) => {
  if (!phase) return "#7F77DD";
  if (phase.includes("Req")) return "#378ADD";
  if (phase.includes("Config")) return "#639922";
  if (phase.includes("UAT")) return "#EF9F27";
  if (phase.includes("Go-Live")) return "#1D9E75";
  if (phase.includes("Hyper")) return "#D4537E";
  if (phase.includes("support") || phase.includes("Transit")) return "#888780";
  return "#7F77DD";
};

const runwayRagColor = (rag) => (
  rag === "Green" ? "#639922" : rag === "Amber" ? "#EF9F27" : "#E24B4A"
);

const startOfDay = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const mapProjectToRunway = (project) => {
  const start =
    parseDate(project.actualStart) ||
    parseDate(project.plannedStart) ||
    parseDate(project.sowPlanStart) ||
    parseDate(project.actualBRDSub) ||
    parseDate(project.plannedBRDSub) ||
    parseDate(project.actualUATStart) ||
    parseDate(project.plannedUATStart) ||
    parseDate(project.plannedGoLive) ||
    parseDate(project.actualGoLive);

  const brd =
    parseDate(project.actualBRDSignoff) ||
    parseDate(project.actualBRDSub) ||
    parseDate(project.plannedBRDSignoff) ||
    parseDate(project.plannedBRDSub);

  const uatStart = parseDate(project.actualUATStart) || parseDate(project.plannedUATStart);
  const uatEnd = parseDate(project.actualUATSignoff) || parseDate(project.plannedUATSignoff);
  const goLive = parseDate(project.actualGoLive);
  const plannedGoLive = parseDate(project.plannedGoLive);

  return {
    name: project.account || "Unknown",
    manager: project.lead || "—",
    consultant: project.consultant || "—",
    region: project.region || "—",
    phase: project.phase || "—",
    rag: project.rag || "Green",
    start,
    brd,
    uatStart,
    uatEnd,
    goLive,
    plannedGoLive,
  };
};

const buildRunwayTicks = (minDate, maxDate, zoom) => {
  const ticks = [];

  if (zoom === "week") {
    let d = new Date(minDate);
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
    let prevMonthKey = null;
    while (d <= maxDate) {
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      ticks.push({
        date: new Date(d),
        label: `W${Math.ceil(d.getDate() / 7)}`,
        newGroup: prevMonthKey !== monthKey,
        groupLabel: prevMonthKey !== monthKey
          ? d.toLocaleString("default", { month:"short", year:"2-digit" })
          : "",
      });
      prevMonthKey = monthKey;
      d = addDays(d, 7);
    }
  } else if (zoom === "month") {
    let d = new Date(minDate.getFullYear(), minDate.getMonth(), 1);
    let prevQuarterKey = null;
    while (d <= maxDate) {
      const quarter = Math.floor(d.getMonth() / 3) + 1;
      const quarterKey = `${d.getFullYear()}-Q${quarter}`;
      ticks.push({
        date: new Date(d),
        label: d.toLocaleString("default", { month:"short" }),
        newGroup: prevQuarterKey !== quarterKey,
        groupLabel: prevQuarterKey !== quarterKey ? `Q${quarter} '${String(d.getFullYear()).slice(2)}` : "",
      });
      prevQuarterKey = quarterKey;
      d = new Date(d.getFullYear(), d.getMonth() + 1, 1);
    }
  } else if (zoom === "quarter") {
    let d = new Date(minDate.getFullYear(), Math.floor(minDate.getMonth() / 3) * 3, 1);
    let prevYear = null;
    while (d <= maxDate) {
      const quarter = Math.floor(d.getMonth() / 3) + 1;
      ticks.push({
        date: new Date(d),
        label: `Q${quarter}`,
        newGroup: prevYear !== d.getFullYear(),
        groupLabel: prevYear !== d.getFullYear() ? String(d.getFullYear()) : "",
      });
      prevYear = d.getFullYear();
      d = new Date(d.getFullYear(), d.getMonth() + 3, 1);
    }
  } else {
    for (let year = minDate.getFullYear(); year <= maxDate.getFullYear(); year += 1) {
      ticks.push({
        date: new Date(year, 0, 1),
        label: String(year),
        newGroup: true,
        groupLabel: "",
      });
    }
  }

  return ticks;
};

const tickWidthForZoom = (zoom) => (
  zoom === "week" ? 30 : zoom === "month" ? 34 : zoom === "quarter" ? 58 : 90
);

function ProjectRunway({ projects }) {
  const [zoom, setZoom] = useState("month");
  const [crossTodayOnly, setCrossTodayOnly] = useState(false);
  const [hoveredRow, setHoveredRow] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const frozenRowRefs = useRef([]);
  const timelineRowRefs = useRef([]);

  const rows = useMemo(
    () => projects.map(mapProjectToRunway),
    [projects]
  );
  const today = startOfDay(new Date());
  const filteredRows = useMemo(() => {
    if (!crossTodayOnly) return rows;
    return rows.filter((row) => {
      const startDate = row.start || row.brd || row.uatStart || row.plannedGoLive || row.goLive;
      const endDate = row.goLive || row.plannedGoLive || row.uatEnd || row.uatStart || row.brd || row.start;
      if (!startDate || !endDate) return false;
      return startOfDay(startDate) <= today && startOfDay(endDate) >= today;
    });
  }, [rows, crossTodayOnly, today]);

  const { minDate, maxDate } = useMemo(() => {
    const allDates = filteredRows.flatMap((row) => [
      row.start,
      row.brd,
      row.uatStart,
      row.uatEnd,
      row.goLive,
      row.plannedGoLive,
    ]).filter(Boolean);

    const minSource = allDates.length ? new Date(Math.min(...allDates.map((date) => date.getTime()))) : today;
    const maxSource = allDates.length ? new Date(Math.max(...allDates.map((date) => date.getTime()))) : today;

    return {
      minDate: startOfDay(addDays(minSource, -45)),
      maxDate: startOfDay(addDays(maxSource, 75)),
    };
  }, [filteredRows, today]);

  const ticks = useMemo(() => buildRunwayTicks(minDate, maxDate, zoom), [minDate, maxDate, zoom]);
  const tickWidth = tickWidthForZoom(zoom);
  const totalWidth = ticks.length * tickWidth;
  const span = Math.max(1, maxDate.getTime() - minDate.getTime());
  const todayPx = Math.round(((today.getTime() - minDate.getTime()) / span) * totalWidth);

  const groupSegments = useMemo(() => {
    const segments = [];
    let start = 0;
    let count = 0;
    let label = "";
    ticks.forEach((tick, index) => {
      if (tick.newGroup) {
        if (count > 0) segments.push({ start, count, label });
        start = index;
        count = 1;
        label = tick.groupLabel;
      } else {
        count += 1;
      }
    });
    if (count > 0) segments.push({ start, count, label });
    return segments;
  }, [ticks]);

  const datePx = (date) => {
    if (!date) return null;
    const clamped = Math.min(Math.max(date.getTime(), minDate.getTime()), maxDate.getTime());
    return Math.round(((clamped - minDate.getTime()) / span) * totalWidth);
  };

  const segStyle = (from, to, color, opacity) => {
    if (!from || !to) return null;
    const start = new Date(Math.max(from.getTime(), minDate.getTime()));
    const end = new Date(Math.min(to.getTime(), maxDate.getTime()));
    if (start >= end) return null;
    const left = Math.round(((start.getTime() - minDate.getTime()) / span) * totalWidth);
    const width = Math.max(2, Math.round(((end.getTime() - start.getTime()) / span) * totalWidth));
    return {
      position:"absolute",
      left,
      width,
      height:14,
      background:color,
      opacity,
      top:"50%",
      transform:"translateY(-50%)",
      borderRadius:2,
    };
  };

  const markerStyle = (date, color, diamond = false) => {
    const left = datePx(date);
    if (left === null) return null;
    return {
      position:"absolute",
      left,
      top:"50%",
      width:9,
      height:9,
      background:color,
      border:"1.5px solid #fff",
      zIndex:6,
      borderRadius:diamond ? 1 : "50%",
      transform: diamond ? "translate(-50%, -50%) rotate(45deg)" : "translate(-50%, -50%)",
    };
  };

  useLayoutEffect(() => {
    const frozenRows = frozenRowRefs.current;
    const timelineRows = timelineRowRefs.current;
    const count = Math.max(frozenRows.length, timelineRows.length);

    for (let index = 0; index < count; index += 1) {
      const frozenRow = frozenRows[index];
      const timelineRow = timelineRows[index];
      if (!frozenRow || !timelineRow) continue;

      frozenRow.style.height = "";
      timelineRow.style.height = "";

      const height = Math.max(frozenRow.offsetHeight, timelineRow.offsetHeight, 33);
      frozenRow.style.height = `${height}px`;
      timelineRow.style.height = `${height}px`;
    }
  }, [filteredRows, ticks, zoom]);

  return (
    <div style={{
      background:"#111827",
      border:"1px solid #263244",
      borderRadius:20,
      padding:"18px 20px 20px",
      boxShadow:"0 1px 3px rgba(2,6,23,0.35), 0 14px 32px rgba(2,6,23,0.3)",
      position:"relative",
    }}>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap", alignItems:"center", padding:"0 0 12px", borderBottom:"1px solid #263244", marginBottom:10, fontSize:12, color:"#9fb0c8" }}>
        {[
          ["Req. gathering", "#378ADD"],
          ["Configuration", "#639922"],
          ["UAT", "#EF9F27"],
          ["Go-live / Hypercare", "#1D9E75"],
          ["Support", "#888780"],
        ].map(([label, color]) => (
          <span key={label} style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#9fb0c8" }}>
            <span style={{ width:10, height:10, borderRadius:2, background:color, flexShrink:0 }} />
            {label}
          </span>
        ))}
        <span style={{ width:1, height:12, background:"#314056" }} />
        <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#9fb0c8" }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"#185FA5", border:"1.5px solid #fff", display:"inline-block" }} />
          BRD
        </span>
        <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#9fb0c8" }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"#BA7517", border:"1.5px solid #fff", display:"inline-block" }} />
          UAT start
        </span>
        <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#9fb0c8" }}>
          <span style={{ width:8, height:8, background:"#0F6E56", transform:"rotate(45deg)", display:"inline-block", border:"1.5px solid #fff" }} />
          Go-live
        </span>
        <span style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#9fb0c8" }}>
          <span style={{ width:2, height:12, background:"#E24B4A", display:"inline-block", borderRadius:1 }} />
          Today
        </span>
        <span style={{ fontSize:12, color:"#9fb0c8", marginLeft:"auto" }}>
          {filteredRows.length} project{filteredRows.length !== 1 ? "s" : ""}
        </span>
        <label style={{ display:"flex", alignItems:"center", gap:6, fontSize:12, color:"#9fb0c8", whiteSpace:"nowrap" }}>
          <input
            type="checkbox"
            checked={crossTodayOnly}
            onChange={(e) => setCrossTodayOnly(e.target.checked)}
            style={{ accentColor:"#2dd4bf" }}
          />
          Cross Today
        </label>
        <div style={{ width:1, height:16, background:"#314056" }} />
        <div style={{ fontSize:12, color:"#9fb0c8", fontWeight:700 }}>Zoom:</div>
        <div style={{ display:"flex", border:"1px solid #263244", borderRadius:12, overflow:"hidden", background:"#0f172a" }}>
          {[
            ["week", "Weeks"],
            ["month", "Months"],
            ["quarter", "Quarters"],
            ["year", "Years"],
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setZoom(value)}
              style={{
                fontSize:12,
                fontWeight:600,
                padding:"7px 12px",
                border:"none",
                borderRight:value === "year" ? "none" : "1px solid #263244",
                background:zoom === value ? "#1f2937" : "#0f172a",
                color:zoom === value ? "#f8fafc" : "#9fb0c8",
                boxShadow:zoom === value ? "inset 0 0 0 1px #314056" : "none",
                cursor:"pointer",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", border:"1px solid #263244", borderRadius:16, overflow:"hidden", width:"100%", background:"#0b1220" }}>
        <div style={{ flexShrink:0, overflow:"hidden", borderRight:"1px solid #314056" }}>
          <table style={{ borderCollapse:"collapse", fontSize:12 }}>
            <thead>
              <tr>
                {[
                  ["Project", 180],
                  ["Manager", 90],
                  ["Consultant", 110],
                  ["Rgn", 48],
                  ["Phase", 88],
                  ["RAG", 56],
                ].map(([label, width]) => (
                  <th key={label} style={{ background:"#111827", borderBottom:"1px solid #263244", fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:"#7f93b0", padding:"9px 8px", whiteSpace:"nowrap", height:36, width }}>{label}</th>
                ))}
              </tr>
              <tr>
                <th colSpan={6} style={{ background:"#111827", borderBottom:"1px solid #263244", height:28 }} />
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => {
                const phaseColor = runwayPhaseColor(row.phase);
                const even = index % 2 === 0;
                return (
                  <tr
                    key={`${row.name}-meta`}
                    ref={(element) => { frozenRowRefs.current[index] = element; }}
                    style={{ background:even ? "#0f172a" : "#111827", height:33 }}
                  >
                    <td style={{ borderBottom:"1px solid #1f2a3d", padding:"8px", verticalAlign:"middle", height:33, width:180 }} title={row.name}>
                      <div style={{ fontWeight:600, fontSize:13, color:"#e5edf7", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", maxWidth:172 }}>{row.name}</div>
                    </td>
                    <td style={{ borderBottom:"1px solid #1f2a3d", padding:"8px", height:33, width:90 }}><span style={{ fontSize:12, color:"#d3dfef" }}>{row.manager}</span></td>
                    <td style={{ borderBottom:"1px solid #1f2a3d", padding:"8px", height:33, width:110 }} title={row.consultant}><span style={{ fontSize:12, color:"#9fb0c8", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis", display:"block", maxWidth:98 }}>{row.consultant}</span></td>
                    <td style={{ borderBottom:"1px solid #1f2a3d", padding:"8px", height:33, width:48 }}><span style={{ fontSize:12, color:"#d3dfef" }}>{row.region}</span></td>
                    <td style={{ borderBottom:"1px solid #1f2a3d", padding:"8px", height:33, width:88 }}>
                      <span style={{ fontSize:11, padding:"2px 8px", borderRadius:10, fontWeight:600, whiteSpace:"nowrap", display:"inline-block", background:`${phaseColor}22`, color:phaseColor, border:`0.5px solid ${phaseColor}55` }}>
                        {row.phase.length > 13 ? `${row.phase.slice(0, 12)}…` : row.phase}
                      </span>
                    </td>
                    <td style={{ borderBottom:"1px solid #1f2a3d", padding:"8px", height:33, width:56, whiteSpace:"nowrap" }}>
                      <span style={{ display:"inline-block", width:7, height:7, borderRadius:"50%", verticalAlign:"middle", marginRight:4, background:runwayRagColor(row.rag) }} />
                      <span style={{ fontSize:11, color:"#9fb0c8", whiteSpace:"nowrap" }}>{row.rag}</span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div style={{ flex:"1 1 0", overflowX:"auto", overflowY:"hidden" }}>
          <table style={{ borderCollapse:"collapse", fontSize:12, width:totalWidth, tableLayout:"fixed" }}>
            <thead>
              <tr>
                {groupSegments.map((segment) => (
                  <th key={`${segment.start}-${segment.label}`} colSpan={segment.count} style={{ background:"#111827", borderBottom:"1px solid #263244", fontSize:11, fontWeight:600, letterSpacing:"0.04em", color:"#9fb0c8", padding:"9px 8px 7px", height:36, whiteSpace:"nowrap", textAlign:"left", borderLeft:"1px solid #314056", verticalAlign:"bottom", width:segment.count * tickWidth }}>
                    {segment.label}
                  </th>
                ))}
              </tr>
              <tr>
                {ticks.map((tick, index) => (
                  <th key={`${tick.label}-${index}`} style={{ background:"#111827", borderBottom:"1px solid #263244", fontSize:11, color:"#7f93b0", padding:"4px 0", height:28, textAlign:"center", borderLeft:tick.newGroup ? "1px solid #314056" : "1px solid #182234", whiteSpace:"nowrap", overflow:"hidden", width:tickWidth }}>
                    {tick.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row, index) => {
                const even = index % 2 === 0;
                const timelineStyle = {
                  position:"relative",
                  width:totalWidth,
                  height:33,
                };
                const bars = [
                  segStyle(row.start, row.brd || row.uatStart, "#378ADD", 0.8),
                  segStyle(row.brd || row.start, row.uatStart, "#639922", 0.85),
                  segStyle(row.uatStart, row.uatEnd || row.goLive || row.plannedGoLive, "#EF9F27", 0.85),
                  segStyle(row.goLive, row.goLive ? addDays(row.goLive, 60) : null, "#1D9E75", 0.85),
                  !row.goLive && row.plannedGoLive && (row.uatStart || row.brd)
                    ? segStyle(row.uatStart || row.brd || row.start, row.plannedGoLive, "#888780", 0.18)
                    : null,
                ].filter(Boolean);
                const markers = [
                  markerStyle(row.brd, "#185FA5"),
                  markerStyle(row.uatStart, "#BA7517"),
                  markerStyle(row.goLive, "#0F6E56", true),
                  !row.goLive && row.plannedGoLive ? markerStyle(row.plannedGoLive, "#888780", true) : null,
                ].filter(Boolean);
                const hasScheduleData = bars.length > 0 || markers.length > 0;

                return (
                  <tr
                    key={`${row.name}-timeline`}
                    ref={(element) => { timelineRowRefs.current[index] = element; }}
                    style={{ background:even ? "#0f172a" : "#111827" }}
                    onMouseMove={(event) => {
                      setHoveredRow(row);
                      setTooltipPos({ x:event.clientX + 16, y:event.clientY + 16 });
                    }}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td colSpan={ticks.length} style={{ borderBottom:"1px solid #1f2a3d", padding:0, borderLeft:"1px solid #182234", width:totalWidth, height:33 }}>
                      <div style={timelineStyle}>
                        {todayPx >= 0 && todayPx <= totalWidth && (
                          <div style={{ position:"absolute", left:todayPx, top:0, width:2, height:"100%", background:"#E24B4A", opacity:0.5, zIndex:4 }} />
                        )}
                        {!hasScheduleData && (
                          <div style={{
                            position:"absolute",
                            left:12,
                            top:"50%",
                            transform:"translateY(-50%)",
                            fontSize:11,
                            color:"#7f93b0",
                            border:"1px dashed #314056",
                            borderRadius:999,
                            padding:"4px 9px",
                            background:"#0f172a",
                          }}>
                            Schedule data not available yet
                          </div>
                        )}
                        {bars.map((style, barIndex) => <div key={barIndex} style={style} />)}
                        {markers.map((style, markerIndex) => <div key={markerIndex} style={style} />)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {hoveredRow && (
        <div style={{
          position:"fixed",
          zIndex:9999,
          background:"#111827",
          border:"1px solid #314056",
          borderRadius:8,
          padding:"8px 11px",
          fontSize:10,
          minWidth:175,
          pointerEvents:"none",
          boxShadow:"0 12px 30px rgba(2,6,23,.42)",
          whiteSpace:"nowrap",
          left:tooltipPos.x,
          top:tooltipPos.y,
        }}>
          <h4 style={{ fontSize:11, fontWeight:600, color:"#e5edf7", marginBottom:5, paddingBottom:4, borderBottom:"1px solid #263244" }}>{hoveredRow.name}</h4>
          {[
            ["Phase", hoveredRow.phase, runwayPhaseColor(hoveredRow.phase)],
            ["SOW start", fmtDate(hoveredRow.start), null],
            ["BRD signoff", fmtDate(hoveredRow.brd), null],
            ["UAT start", fmtDate(hoveredRow.uatStart), null],
            ["Go-live", fmtDate(hoveredRow.goLive), null],
            ["Planned go-live", fmtDate(hoveredRow.plannedGoLive), null],
            ["RAG", hoveredRow.rag, runwayRagColor(hoveredRow.rag)],
          ].map(([label, value, color]) => (
            <div key={label} style={{ display:"flex", justifyContent:"space-between", gap:12, marginTop:2 }}>
              <span style={{ color:"#8ea3bf" }}>{label}</span>
              <span style={{ fontWeight:600, color:color || "#f8fafc" }}>{value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [projects, setProjects]       = useState(FALLBACK);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [syncing, setSyncing]         = useState(false);
  const [syncMsg, setSyncMsg]         = useState(null);
  const [filters, setFilters]         = useState({rag:"all",phase:"all",region:"all",lead:"all",vertical:"all",search:""});
  const [sortKey, setSortKey]         = useState("account");
  const [sortDir, setSortDir]         = useState(1);
  const [expanded, setExpanded]       = useState(null);
  const [debugLog, setDebugLog]       = useState(null);
  const [showDebug, setShowDebug]     = useState(false);
  const [view, setView]               = useState("dashboard");

  const sync = useCallback(async (force = false) => {
    setSyncing(true); setSyncMsg(null); setDebugLog(null);
    try {
      const url = "https://facilio958-my.sharepoint.com/personal/shivaraj_facilio_com/_layouts/15/download.aspx?share=IQB6lxWOZaPkSLrCt_VqoDbNAYl6eoglJtu89lPV8LB3rAg";
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Fetch failed: ${res.status}`);
      const data = await res.arrayBuffer();
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = "In Progress";
      if (!workbook.Sheets[sheetName]) throw new Error(`Sheet "${sheetName}" not found`);
      const sheet = workbook.Sheets[sheetName];
      const json = XLSX.utils.sheet_to_json(sheet, { header: 1, raw: false });
      if (json.length < 2) throw new Error("No data in sheet");

      const headers = json[0].map((h) => h || "");
      const normalizedHeaders = headers.map(normalizeHeader);
      const rows = json.slice(1);

      const colMap = {};
      const possibleCols = {
        account: ["account", "project", "client", "customer", "name"],
        vertical: ["vertical", "business unit", "bu", "type"],
        region: ["region", "location", "area"],
        phase: ["phase", "stage", "status"],
        rag: ["rag", "risk", "priority", "timeline"],
        status: ["status", "state"],
        lead: ["lead", "manager", "owner", "pm"],
        consultant: ["consultant", "developer", "engineer", "consultant/s"],
        comments: ["comments", "notes", "description", "latest status", "summary"],
        plannedGoLive: ["planned go-live date", "planned golive", "planned go live", "go live planned", "planned deployment date"],
        actualGoLive: ["actual go-live date", "actual golive", "actual go live", "go live actual", "actual deployment date"],
        clientPOC: ["client poc", "client contact"],
        sowPlanStart: ["sow - plan start date", "sow plan start", "sow start", "sow planned start"],
        sowPlanEnd: ["sow - plan end date", "sow plan end", "sow end", "sow planned end"],
        plannedStart: ["planned start date", "project planned start", "implementation planned start"],
        actualStart: ["actual start date", "project actual start", "implementation actual start"],
        plannedBRDSub: ["planned brd submission date", "planned brd submission", "brd submission planned"],
        actualBRDSub: ["actual brd submission date", "actual brd submission", "brd submission actual"],
        plannedBRDSignoff: ["planned brd signoff", "planned brd sign off", "brd signoff planned", "planned brd approval"],
        actualBRDSignoff: ["actual brd signoff", "actual brd sign off", "brd signoff actual", "actual brd approval"],
        plannedUATStart: ["planned uat start", "uat start planned", "planned uat start date"],
        actualUATStart: ["actual uat start", "uat start actual", "actual uat start date"],
        plannedUATSignoff: ["planned uat sign off", "planned uat signoff", "uat signoff planned", "planned uat completion"],
        actualUATSignoff: ["actual uat sign off", "actual uat signoff", "uat signoff actual", "actual uat completion"],
        projectPlan: ["project plan"],
        msa: ["msa"],
        governanceFolder: ["link to project governance folder"],
        brd: ["brd"],
        wsr: ["wsr"],
        functionalTestReport: ["functional test report"]
      };
      const findColumnIndex = (aliases) => {
        const normalizedAliases = aliases.map(normalizeHeader);
        for (let index = 0; index < normalizedHeaders.length; index += 1) {
          const header = normalizedHeaders[index];
          if (normalizedAliases.some((alias) => header === alias || header.includes(alias) || alias.includes(header))) {
            return index;
          }
        }
        return undefined;
      };
      for (const [key, aliases] of Object.entries(possibleCols)) {
        colMap[key] = findColumnIndex(aliases);
      }

      const mapped = rows.map(row => ({
        account: row[colMap.account] || "Unknown",
        vertical: row[colMap.vertical] || "",
        region: row[colMap.region] || "",
        phase: row[colMap.phase] || "",
        rag: row[colMap.rag] || "Green",
        status: row[colMap.status] || "Active",
        lead: row[colMap.lead] || "",
        consultant: row[colMap.consultant] || "",
        comments: row[colMap.comments] || "",
        plannedGoLive: row[colMap.plannedGoLive] || "",
        actualGoLive: row[colMap.actualGoLive] || "",
        clientPOC: row[colMap.clientPOC] || "",
        sowPlanStart: row[colMap.sowPlanStart] || "",
        sowPlanEnd: row[colMap.sowPlanEnd] || "",
        plannedStart: row[colMap.plannedStart] || "",
        actualStart: row[colMap.actualStart] || "",
        plannedBRDSub: row[colMap.plannedBRDSub] || "",
        actualBRDSub: row[colMap.actualBRDSub] || "",
        plannedBRDSignoff: row[colMap.plannedBRDSignoff] || "",
        actualBRDSignoff: row[colMap.actualBRDSignoff] || "",
        plannedUATStart: row[colMap.plannedUATStart] || "",
        actualUATStart: row[colMap.actualUATStart] || "",
        plannedUATSignoff: row[colMap.plannedUATSignoff] || "",
        actualUATSignoff: row[colMap.actualUATSignoff] || "",
        projectPlan: row[colMap.projectPlan] || "",
        msa: row[colMap.msa] || "",
        governanceFolder: row[colMap.governanceFolder] || "",
        brd: row[colMap.brd] || "",
        wsr: row[colMap.wsr] || "",
        functionalTestReport: row[colMap.functionalTestReport] || ""
      })).filter(p => p.account && p.account !== "Unknown");

      setProjects(mapped);
      const ts = Date.now(); setLastUpdated(ts);
      setSyncMsg({ ok: true, text: `Synced ${mapped.length} projects from SharePoint` });
    } catch (e) {
      setSyncMsg({ ok: false, text: `Sync error: ${e.message}` });
      setDebugLog(`Exception: ${e.message}`);
      setShowDebug(true);
    } finally { setSyncing(false); }
  }, []);

  useEffect(() => {
    sync();
    const iv = setInterval(() => sync(), TWELVE_HRS);
    return () => clearInterval(iv);
  }, [sync]);

  const stats = useMemo(() => {
    const live = projects.filter(p => p.status !== "Transitioned");
    const active = projects.filter(p => p.status === "Active");
    const hyp = projects.filter(p => p.status === "Hypercare");
    return {
      total: projects.length,
      active: active.length, hypercare: hyp.length,
      green:  live.filter(p=>p.rag==="Green").length,
      amber:  live.filter(p=>p.rag==="Amber").length,
      red:    live.filter(p=>p.rag==="Red").length,
      phase: PHASES.reduce((acc,ph) => (acc[ph] = live.filter(p=>p.phase.toLowerCase() === ph.toLowerCase()).length, acc), {}),
      regions: [...new Set(live.map(p=>p.region).filter(r=>r))].sort(),
      regionCounts: live.reduce((acc,p) => (acc[p.region] = (acc[p.region]||0)+1, acc), {}),
      leads: [...new Set(live.map(p=>p.lead).filter(l=>l))].sort(),
      leadCounts: live.reduce((acc,p) => (acc[p.lead] = (acc[p.lead]||0)+1, acc), {}),
      verticals: [...new Set(live.map(p=>p.vertical).filter(v=>v))].sort(),
      verticalCounts: live.reduce((acc,p) => (acc[p.vertical] = (acc[p.vertical]||0)+1, acc), {})
    };
  }, [projects]);

  const filteredBase = useMemo(() => {
    return projects.filter(p => {
      if (filters.rag!=="all" && p.rag!==filters.rag) return false;
      if (filters.phase!=="all" && p.phase.toLowerCase()!==filters.phase.toLowerCase()) return false;
      if (filters.region!=="all" && p.region!==filters.region) return false;
      if (filters.lead!=="all" && p.lead!==filters.lead) return false;
      if (filters.vertical!=="all" && p.vertical!==filters.vertical) return false;
      if (filters.search) {
        const q=filters.search.toLowerCase();
        return [p.account,p.region,p.lead,p.consultant,p.comments].some(v=>(v||"").toLowerCase().includes(q));
      }
      return true;
    });
  }, [projects, filters]);

  const filtered = useMemo(() => {
    return [...filteredBase].sort((a,b) => {
      const av=a[sortKey]||"", bv=b[sortKey]||"";
      return av.localeCompare(bv)*sortDir;
    });
  }, [filteredBase, sortKey, sortDir]);

  const toggleSort = (key) => {
    if (sortKey===key) setSortDir(d=>-d); else { setSortKey(key); setSortDir(1); }
  };

  const setFilter = (k,v) => setFilters(f=>({...f,[k]:v}));

  // ── Styles ────────────────────────────────────────────────────────────────────
  const S = {
    wrap:  { fontFamily:"'Manrope', system-ui, sans-serif", minHeight:"100vh", color:"#d8e2f0", background:"radial-gradient(circle at top, #172033 0%, #0b1120 52%, #060a14 100%)" },

    // Ribbon — exact match to reference page
    ribbon: {
      background:"#090f1d",
      borderBottom:"1px solid #1f2a3d",
      padding:"0 24px", minHeight:64,
      display:"flex", alignItems:"center", justifyContent:"space-between",
      position:"sticky", top:0, zIndex:50
    },
    ribbonLeft:  { display:"flex", alignItems:"center", gap:12, flexShrink:0 },
    ribbonCenter:{ display:"flex", alignItems:"center", gap:14, minWidth:0, margin:"0 18px", flex:"1 1 auto" },
    ribbonTitle: { fontSize:23, fontWeight:800, color:"#f8fafc", letterSpacing:"-0.04em", lineHeight:1, whiteSpace:"nowrap" },
    ribbonMeta:  { fontSize:11, color:"#91a4bd", whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" },
    ribbonRight: { display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", justifyContent:"flex-end" },

    shell: { maxWidth:1440, margin:"0 auto", padding:"10px 20px 40px" },
    heroPanel:{ display:"grid", gridTemplateColumns:"1fr", gap:10, alignItems:"stretch" },

    header: {
      background:"rgba(15,23,42,0.88)", border:"1px solid #263244", padding:"10px 20px",
      display:"flex", alignItems:"center", justifyContent:"space-between", gap:20,
      borderRadius:18, boxShadow:"0 12px 28px rgba(2,6,23,0.35)"
    },
    headerMain:{ position:"relative", overflow:"hidden" },
    headerGlow:{ display:"none" },

    brand:     { display:"flex", alignItems:"center", gap:12 },
    logo:      { width:38, height:38, borderRadius:12, background:"linear-gradient(135deg,#14b8a6,#2563eb)", boxShadow:"0 4px 12px rgba(37,99,235,0.22)", display:"flex", alignItems:"center", justifyContent:"center", color:"#ffffff", flexShrink:0 },
    brandText: { display:"flex", flexDirection:"column", gap:3 },
    wordmark:  { fontSize:17, fontWeight:800, color:"#f8fafc", letterSpacing:"-0.04em", lineHeight:1 },
    heroText:  { display:"flex", flexDirection:"column", alignItems:"flex-start", gap:8, marginTop:0 },
    eyebrow:   { fontSize:11, fontWeight:700, color:"#5eead4", letterSpacing:"0.16em", textTransform:"uppercase" },
    title:     { fontSize:28, fontWeight:800, color:"#f8fafc", letterSpacing:"-0.04em", lineHeight:1, whiteSpace:"nowrap" },
    sub:       { fontSize:13, color:"#8ea3bf", lineHeight:1.55, maxWidth:760 },
    statLine:  { display:"flex", gap:8, flexWrap:"wrap", marginTop:4 },
    statChip:  { fontSize:11, color:"#9fb0c8", background:"#101826", border:"1px solid #263244", borderRadius:999, padding:"4px 9px" },
    syncRow:   { display:"flex", gap:8, flexWrap:"wrap", alignItems:"center", marginTop:2 },
    syncBtn:   {
      background: syncing?"#101826":"linear-gradient(135deg,#0f766e,#1d4ed8)",
      border:"1px solid " + (syncing?"#263244":"transparent"),
      color: syncing?"#6f849f":"#ffffff",
      borderRadius:10, padding:"7px 12px", fontSize:12, fontWeight:700,
      cursor: syncing?"not-allowed":"pointer", display:"flex", alignItems:"center", gap:6,
      boxShadow: syncing?"none":"0 2px 8px rgba(37,99,235,0.18)"
    },

    spotlightCard:  { background:"#1B0E51", border:"1px solid rgba(48,24,148,0.6)", borderRadius:18, padding:"16px 18px", display:"flex", alignItems:"center", justifyContent:"space-between", gap:20, minWidth:380, maxWidth:560, width:"100%", boxShadow:"0 4px 20px rgba(15,23,42,0.12)" },
    spotlightLabel: { fontSize:10, color:"#67e8f9", fontWeight:700, letterSpacing:"0.16em", textTransform:"uppercase" },
    spotlightValue: { fontSize:38, fontWeight:800, lineHeight:0.95, letterSpacing:"-0.05em", color:"#ffffff", marginTop:8 },
    spotlightText:  { fontSize:11, color:"rgba(255,255,255,0.50)", lineHeight:1.5, marginTop:8, maxWidth:200 },
    spotlightStack: { display:"grid", gridTemplateColumns:"repeat(3,minmax(100px,1fr))", gap:8, flex:1 },
    spotlightRow:   { display:"flex", flexDirection:"column", alignItems:"flex-start", justifyContent:"space-between", gap:6, padding:"10px 12px", borderRadius:12, background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.08)", minHeight:80 },
    spotlightName:  { fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.60)", lineHeight:1.35 },
    spotlightMeta:  { fontSize:20, fontWeight:800, lineHeight:1, marginTop:"auto" },

    kpiRow: { display:"grid", gridTemplateColumns:"repeat(4,minmax(0,1fr))", gap:10, padding:"10px 0 0" },
    kpi:    { background:"#0f172a", border:"1px solid #263244", borderRadius:16, padding:"14px 16px 13px", boxShadow:"0 12px 28px rgba(2,6,23,0.22)" },
    kpiNum: { fontSize:25, fontWeight:800, lineHeight:1, letterSpacing:"-0.03em" },
    kpiLbl: { fontSize:10, color:"#7f93b0", marginTop:7, fontWeight:700, letterSpacing:"0.08em", textTransform:"uppercase" },

    section:     { padding:"10px 0 0" },
    sectionCard: { background:"#0f172a", border:"1px solid #263244", borderRadius:18, padding:"14px 16px", boxShadow:"0 12px 28px rgba(2,6,23,0.22)" },
    sectionTitle:{ fontSize:10, color:"#7f93b0", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", marginBottom:10 },
    viewRow: { display:"flex", justifyContent:"space-between", alignItems:"center", gap:12, flexWrap:"wrap", padding:"12px 0 2px" },
    viewHint: { fontSize:12, color:"#8ea3bf" },

    pipeline: { display:"flex", gap:8, alignItems:"stretch", overflowX:"auto" },
    pipeItem: { flex:"1 1 0", minWidth:92, background:"#101826", border:"1px solid #263244", borderRadius:12, padding:"10px 12px", cursor:"pointer", transition:"transform 0.18s, border-color 0.18s, box-shadow 0.18s" },
    pipeCount:{ fontSize:20, fontWeight:700, letterSpacing:"-0.02em" },
    pipeLabel:{ fontSize:10, color:"#7f93b0", fontWeight:700, marginTop:4, lineHeight:1.35, letterSpacing:"0.05em", textTransform:"uppercase" },

    tabs: { display:"flex", gap:3, background:"#101826", borderRadius:12, padding:3, border:"1px solid #263244" },
    tab:  (active) => ({ padding:"7px 14px", borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer", transition:"all 0.15s", background:active?"#1f2937":"transparent", color:active?"#f8fafc":"#8ea3bf", border:"none", boxShadow:active?"inset 0 0 0 1px #314056":"none" }),

    filters: { display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" },
    sel:     { background:"#101826", border:"1px solid #263244", color:"#d8e2f0", borderRadius:10, padding:"8px 11px", fontSize:12, outline:"none" },
    search:  { background:"#101826", border:"1px solid #263244", color:"#d8e2f0", borderRadius:10, padding:"8px 13px", fontSize:12, outline:"none", flex:1, minWidth:180 },

    table: { width:"100%", borderCollapse:"collapse", fontSize:13 },
    th:    (active) => ({ padding:"9px 12px", textAlign:"left", fontSize:11, fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", color:active?"#5eead4":"#7f93b0", background:"#111827", borderBottom:"1px solid #263244", cursor:"pointer", whiteSpace:"nowrap" }),
    tr:    (i,exp) => ({ background: exp?"#132033":(i%2===0?"#0f172a":"#111827"), borderBottom:"1px solid #1f2a3d", cursor:"pointer", transition:"background 0.12s" }),
    td:    { padding:"10px 12px", verticalAlign:"middle" },
    expRow:{ background:"#132033", borderBottom:"1px solid #1f2a3d" },

    badge: (color,bg) => ({ fontSize:11, fontWeight:600, padding:"2px 8px", borderRadius:10, color, background:bg, display:"inline-flex", alignItems:"center", gap:4 }),
    count: { fontSize:11, color:"inherit", marginLeft:4, opacity:0.65 },
    msg:   (ok) => ({ fontSize:12, color:ok?"#166534":"#92400e", background:ok?"#f0fdf4":"#fffbeb", border:"1px solid "+(ok?"#bbf7d0":"#fde68a"), padding:"7px 10px", borderRadius:999, display:"flex", alignItems:"center", gap:4 }),
    empty: { textAlign:"center", padding:"40px 20px", color:"#7f93b0" },
    footer:{ padding:"10px 14px", background:"#111827", borderTop:"1px solid #263244", fontSize:11, color:"#7f93b0", display:"flex", justifyContent:"space-between", gap:10, flexWrap:"wrap" },
    regionCard: { background:"#0f172a", border:"1px solid #263244", borderRadius:14, padding:"12px 16px", minWidth:132, boxShadow:"0 12px 24px rgba(2,6,23,0.2)" },
  };

  const TH = ({ k, label }) => (
    <th style={S.th(sortKey===k)} onClick={()=>toggleSort(k)}>
      {label} {sortKey===k ? (sortDir===1?"↑":"↓") : ""}
    </th>
  );

  return (
    <div style={S.wrap}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap');
        *{box-sizing:border-box}
        input::placeholder{color:#7f93b0}
        select option{background:#0f172a;color:#d8e2f0}
        tr:hover td{background:#172437!important}
        .pipe-item:hover{transform:translateY(-2px);border-color:#2dd4bf!important;box-shadow:0 12px 24px rgba(2,6,23,0.28)!important}
        a{color:inherit}
        .dashboard-grid{display:grid;gap:14px}
        .dashboard-toolbar{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
        .hero-panel{display:grid;grid-template-columns:1fr;gap:14px;align-items:stretch}
        .hero-header-grid{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}
        @media (max-width: 1100px){.dashboard-grid{grid-template-columns:1fr 1fr}}
        @media (max-width: 1100px){.hero-card-title{font-size:34px}}
        @media (max-width: 860px){.hero-header-grid{flex-direction:column}.hero-spotlight{max-width:none!important;width:100%}}
        @media (max-width: 780px){.dashboard-grid{grid-template-columns:1fr}.dashboard-header{padding:18px}.dashboard-section{padding:18px}}
        @media (max-width: 680px){.dashboard-footer{flex-direction:column}.dashboard-toolbar{justify-content:flex-start}}
        @keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
      `}</style>

      {/* ── Ribbon ── */}
      <div style={S.ribbon}>
        <div style={S.ribbonLeft}>
          <img src={FACILIO_LOGO} alt="Facilio" style={{ height:36, width:"auto", objectFit:"contain", display:"block", borderRadius:8 }} />
        </div>
        <div style={S.ribbonCenter}>
          <div style={S.ribbonTitle}>Implementation Dashboard</div>
          <div style={S.ribbonMeta}>
            {lastUpdated ? `Last synced ${fmtTime(lastUpdated)}` : "Sync in progress"}
          </div>
        </div>
        <div style={S.ribbonRight}>
          {syncMsg && <div style={S.msg(syncMsg.ok)}>{syncMsg.ok?"✓":"⚠"} {syncMsg.text}</div>}
          <button style={S.syncBtn} onClick={()=>sync(true)} disabled={syncing}>
            {syncing ? <span style={{ display:"inline-block", animation:"spin 1s linear infinite" }}>↻</span> : "↻"}
            {syncing ? "Syncing…" : "Sync Now"}
          </button>
        </div>
      </div>

      <div style={S.shell}>
        {/* ── KPI Cards ── */}
        <div className="dashboard-grid" style={S.kpiRow}>
          {[
            { num:stats.total,  label:"Total Projects", color:"#2563eb", ragKey:null,    onClick: () => setFilters({rag:"all",phase:"all",region:"all",lead:"all",vertical:"all",search:""}) },
            { num:stats.green,  label:"On Track",       color:"#059669", ragKey:"Green", onClick: () => setFilter("rag", filters.rag === "Green" ? "all" : "Green") },
            { num:stats.amber,  label:"At Risk",        color:"#d97706", ragKey:"Amber", onClick: () => setFilter("rag", filters.rag === "Amber" ? "all" : "Amber") },
            { num:stats.red,    label:"Critical",       color:"#dc2626", ragKey:"Red",   onClick: () => setFilter("rag", filters.rag === "Red" ? "all" : "Red") },
          ].map(({num,label,color,ragKey,onClick})=>{
            const active = ragKey
              ? filters.rag === ragKey
              : (
                  filters.rag === "all" &&
                  filters.phase === "all" &&
                  filters.region === "all" &&
                  filters.lead === "all" &&
                  filters.vertical === "all" &&
                  !filters.search
                );
            return (
              <div key={label} style={{
                ...S.kpi,
                cursor:"pointer",
                borderTop:`3px solid ${color}`,
                background: active ? `linear-gradient(180deg, ${color}16 0%, rgba(15,23,42,0.94) 100%)` : "#0f172a",
                boxShadow: active ? `0 0 0 1px ${color}55, 0 10px 24px rgba(2,6,23,0.26)` : S.kpi.boxShadow,
                transform: active ? "translateY(-1px)" : "none",
                transition:"all 0.15s"
              }} onClick={onClick}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                  <div style={{...S.kpiNum, color}}>{num}</div>
                </div>
                <div style={S.kpiLbl}>{label}</div>
              </div>
            );
          })}
        </div>

        {/* ── Phase Pipeline ── */}
        <div style={S.section}>
          <div className="dashboard-section" style={S.sectionCard}>
            <div style={S.sectionTitle}>Implementation pipeline</div>
            <div style={{...S.pipeline, display:"flex", flexDirection:"column", gap:18 }}>
              <div style={{display:"flex", gap:8, alignItems:"center", overflowX:"auto"}}>
                {PHASES.map(ph => {
                  const m = PHASE_META[ph]; const count = stats.phase[ph]||0;
                  const active = filters.phase===ph;
                  return (
                    <div key={ph} className="pipe-item" style={{
                      ...S.pipeItem,
                      background: active ? `linear-gradient(180deg, ${m.bg} 0%, rgba(15,23,42,0.92) 100%)` : "#101826",
                      borderColor: active ? m.color : "#263244",
                      borderTopWidth: active ? 2 : 1
                    }} onClick={()=>setFilter("phase", active?"all":ph)}>
                      <div style={{...S.pipeCount, color:m.color}}>{count}</div>
                      <div style={S.pipeLabel}>{ph}</div>
                    </div>
                  );
                })}
              </div>
              <div className="dashboard-toolbar">
                <div style={S.filters}>
                  <select style={S.sel} value={filters.region} onChange={e=>setFilter("region",e.target.value)}>
                    <option value="all">All Regions</option>
                    {stats.regions.map(r=><option key={r} value={r}>{r} ({stats.regionCounts[r]||0})</option>)}
                  </select>
                  <select style={S.sel} value={filters.lead} onChange={e=>setFilter("lead",e.target.value)}>
                    <option value="all">All Managers</option>
                    {stats.leads.map(l=><option key={l} value={l}>{l} ({stats.leadCounts[l]||0})</option>)}
                  </select>
                  <select style={S.sel} value={filters.vertical} onChange={e=>setFilter("vertical",e.target.value)}>
                    <option value="all">All Verticals</option>
                    {stats.verticals.map(v=><option key={v} value={v}>{v} ({stats.verticalCounts[v]||0})</option>)}
                  </select>
                  <input style={S.search} placeholder="Search projects, accounts…"
                    value={filters.search} onChange={e=>setFilter("search",e.target.value)} />
                  {(filters.rag!=="all"||filters.phase!=="all"||filters.region!=="all"||filters.lead!=="all"||filters.vertical!=="all"||filters.search) &&
                    <button style={{...S.sel,cursor:"pointer",color:"#fca5a5",borderColor:"#7f1d1d",background:"#241113"}}
                      onClick={()=>setFilters({rag:"all",phase:"all",region:"all",lead:"all",vertical:"all",search:""})}>
                      Clear ×
                    </button>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={S.viewRow}>
          <div style={S.tabs}>
            <button type="button" style={S.tab(view==="dashboard")} onClick={() => setView("dashboard")}>Dashboard</button>
            <button type="button" style={S.tab(view==="runway")} onClick={() => setView("runway")}>Project Timeline</button>
          </div>
          <div style={S.viewHint}>
            {view === "dashboard" ? "Portfolio KPIs, filters, and project details" : "Timeline view built from the same Implementation Dashboard source data"}
          </div>
        </div>

        {view === "dashboard" ? (
        <>
        <div style={S.section}>
          <div className="dashboard-section" style={S.sectionCard}>
            <div style={{ border:"1px solid #263244", borderRadius:16, overflow:"hidden", background:"#0b1220" }}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <TH k="account"       label="Account" />
                    <TH k="phase"         label="Phase" />
                    <TH k="lead"          label="Manager" />
                    <TH k="vertical"      label="Vertical" />
                    <TH k="region"        label="Region" />
                    <TH k="plannedGoLive" label="Planned Go-Live" />
                    <TH k="actualGoLive"  label="Actual Go-Live" />
                    <TH k="consultant"    label="Consultant/S" />
                    <TH k="rag"           label="RAG" />
                    <TH k="comments"      label="Latest Status" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr><td colSpan={10} style={S.empty}>No projects match the current filters.</td></tr>
                  ) : filtered.map((p,i) => {
                    const isExp = expanded === p.account;
                    const rag = RAG_META[p.rag]||RAG_META.Green;
                    return [
                      <tr key={p.account} style={S.tr(i,isExp)} onClick={()=>setExpanded(isExp?null:p.account)}>
                        <td style={{...S.td, fontWeight:600, color:"#e5edf7"}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <span style={{color:"#7f93b0",fontSize:10}}>{isExp?"▼":"▶"}</span>
                            {p.account}
                          </div>
                        </td>
                        <td style={S.td}><PhasePill phase={p.phase} /></td>
                        <td style={{...S.td, color:"#d3dfef"}}>{p.lead||"—"}</td>
                        <td style={S.td}><VertPill v={p.vertical} /></td>
                        <td style={{...S.td, color:"#d3dfef"}}>{p.region}</td>
                        <td style={{...S.td, color:"#d3dfef"}}>{p.plannedGoLive||"—"}</td>
                        <td style={{...S.td, color:"#d3dfef"}}>{p.actualGoLive||"—"}</td>
                        <td style={{...S.td, color:"#9fb0c8", fontSize:12}}>{p.consultant||"—"}</td>
                        <td style={S.td}>
                          <span style={S.badge(rag.color, rag.bg)}>
                            <RAGDot rag={p.rag} /> {p.rag}
                          </span>
                        </td>
                        <td style={{...S.td, color:"#9fb0c8", fontSize:12, maxWidth:220}}>
                          <span style={{display:"block",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>
                            {p.comments||"—"}
                          </span>
                        </td>
                      </tr>,
                      isExp && (
                        <tr key={p.account+"-exp"} style={S.expRow}>
                          <td colSpan={10} style={{ padding:"14px 24px" }}>
                            <div style={{ display:"flex", gap:32, flexWrap:"wrap" }}>
                              <div>
                                <div style={{ fontSize:10, color:"#7f93b0", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:4 }}>Full Status</div>
                                <div style={{ fontSize:13, color:"#d8e2f0", maxWidth:480, lineHeight:1.6 }}>{p.comments||"No comments."}</div>
                              </div>
                              <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                                {[
                                  ["Client POC", p.clientPOC],
                                  ["SOW Plan Start", p.sowPlanStart],
                                  ["SOW Plan End", p.sowPlanEnd],
                                  ["Planned Start", p.plannedStart],
                                  ["Actual Start", p.actualStart],
                                  ["Planned BRD Submission", p.plannedBRDSub],
                                  ["Actual BRD Submission", p.actualBRDSub],
                                  ["Planned BRD Signoff", p.plannedBRDSignoff],
                                  ["Actual BRD Signoff", p.actualBRDSignoff],
                                  ["Planned UAT Start", p.plannedUATStart],
                                  ["Actual UAT Start", p.actualUATStart],
                                  ["Planned UAT Signoff", p.plannedUATSignoff],
                                  ["Actual UAT Signoff", p.actualUATSignoff]
                                ].map(([k,v])=>(
                                  <div key={k}>
                                    <div style={{ fontSize:10, color:"#7f93b0", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>{k}</div>
                                    <div style={{ fontSize:13, color:"#d8e2f0", fontWeight:500 }}>{v||"—"}</div>
                                  </div>
                                ))}
                              </div>
                              <div style={{ display:"flex", gap:24, flexWrap:"wrap" }}>
                                {[
                                  ["Project Plan", p.projectPlan],
                                  ["MSA", p.msa],
                                  ["Governance Folder", p.governanceFolder],
                                  ["BRD", p.brd],
                                  ["WSR", p.wsr],
                                  ["Functional Test Report", p.functionalTestReport]
                                ].map(([k,v])=>(
                                  <div key={k}>
                                    <div style={{ fontSize:10, color:"#7f93b0", textTransform:"uppercase", letterSpacing:"0.05em", marginBottom:3 }}>{k}</div>
                                    <div style={{ fontSize:13, color:"#d8e2f0", fontWeight:500 }}>
                                      {v ? <a href={v} target="_blank" rel="noopener noreferrer" style={{color:"#5eead4"}}>Link</a> : "—"}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    ];
                  })}
                </tbody>
              </table>
              <div className="dashboard-footer" style={S.footer}>
                <span>Showing {filtered.length} of {projects.length} projects</span>
                <span>Source: Connected CMMS Project Status.xlsx · SharePoint · {lastUpdated?fmtTime(lastUpdated):"pending"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Debug Panel ── */}
        {debugLog && (
          <div style={{ ...S.section, paddingTop:16 }}>
            <button onClick={()=>setShowDebug(v=>!v)}
              style={{ fontSize:11, color:"#9fb0c8", background:"#101826", border:"1px solid #263244",
                borderRadius:10, padding:"8px 12px", cursor:"pointer" }}>
              {showDebug?"▲ Hide":"▼ Show"} sync debug log
            </button>
            {showDebug && (
              <pre style={{ fontSize:11, color:"#d8e2f0", background:"#0f172a", border:"1px solid #263244",
                borderRadius:16, padding:"14px 16px", marginTop:10, overflowX:"auto", lineHeight:1.6,
                whiteSpace:"pre-wrap", wordBreak:"break-word" }}>
                {debugLog}
              </pre>
            )}
          </div>
        )}
        </>
        ) : (
          <div style={{ paddingTop:16 }}>
            <ProjectRunway projects={filteredBase} />
          </div>
        )}

      </div>
    </div>
  );
}
