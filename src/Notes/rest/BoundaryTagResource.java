package ir.donyapardaz.niopdc.base.web.rest;

import com.codahale.metrics.annotation.Timed;
import ir.donyapardaz.niopdc.base.service.BoundaryTagService;
import ir.donyapardaz.niopdc.base.web.rest.errors.BadRequestAlertException;
import ir.donyapardaz.niopdc.base.web.rest.util.HeaderUtil;
import ir.donyapardaz.niopdc.base.web.rest.util.PaginationUtil;
import ir.donyapardaz.niopdc.base.service.dto.BoundaryTagDTO;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for managing BoundaryTag.
 */
@RestController
@RequestMapping("/api")
public class BoundaryTagResource {

    private final Logger log = LoggerFactory.getLogger(BoundaryTagResource.class);

    private static final String ENTITY_NAME = "boundaryTag";

    private final BoundaryTagService boundaryTagService;

    public BoundaryTagResource(BoundaryTagService boundaryTagService) {
        this.boundaryTagService = boundaryTagService;
    }

    /**
     * POST  /boundary-tags : Create a new boundaryTag.
     *
     * @param boundaryTagDTO the boundaryTagDTO to create
     * @return the ResponseEntity with status 201 (Created) and with body the new boundaryTagDTO, or with status 400 (Bad Request) if the boundaryTag has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/boundary-tags")
    @Timed
    public ResponseEntity<BoundaryTagDTO> createBoundaryTag(@Valid @RequestBody BoundaryTagDTO boundaryTagDTO) throws URISyntaxException {
        log.debug("REST request to save BoundaryTag : {}", boundaryTagDTO);
        if (boundaryTagDTO.getId() != null) {
            throw new BadRequestAlertException("A new boundaryTag cannot already have an ID", ENTITY_NAME, "idexists");
        }
        BoundaryTagDTO result = boundaryTagService.save(boundaryTagDTO);
        return ResponseEntity.created(new URI("/api/boundary-tags/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /boundary-tags : Updates an existing boundaryTag.
     *
     * @param boundaryTagDTO the boundaryTagDTO to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated boundaryTagDTO,
     * or with status 400 (Bad Request) if the boundaryTagDTO is not valid,
     * or with status 500 (Internal Server Error) if the boundaryTagDTO couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/boundary-tags")
    @Timed
    public ResponseEntity<BoundaryTagDTO> updateBoundaryTag(@Valid @RequestBody BoundaryTagDTO boundaryTagDTO) throws URISyntaxException {
        log.debug("REST request to update BoundaryTag : {}", boundaryTagDTO);
        if (boundaryTagDTO.getId() == null) {
            return createBoundaryTag(boundaryTagDTO);
        }
        BoundaryTagDTO result = boundaryTagService.save(boundaryTagDTO);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, boundaryTagDTO.getId().toString()))
            .body(result);
    }

    /**
     * GET  /boundary-tags : get all the boundaryTags.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of boundaryTags in body
     */
    @GetMapping("/boundary-tags")
    @Timed
    public ResponseEntity<List<BoundaryTagDTO>> getAllBoundaryTags(Pageable pageable) {
        log.debug("REST request to get a page of BoundaryTags");
        Page<BoundaryTagDTO> page = boundaryTagService.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/boundary-tags");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /boundary-tags/:id : get the "id" boundaryTag.
     *
     * @param id the id of the boundaryTagDTO to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the boundaryTagDTO, or with status 404 (Not Found)
     */
    @GetMapping("/boundary-tags/{id}")
    @Timed
    public ResponseEntity<BoundaryTagDTO> getBoundaryTag(@PathVariable Long id) {
        log.debug("REST request to get BoundaryTag : {}", id);
        BoundaryTagDTO boundaryTagDTO = boundaryTagService.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(boundaryTagDTO));
    }

    /**
     * DELETE  /boundary-tags/:id : delete the "id" boundaryTag.
     *
     * @param id the id of the boundaryTagDTO to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/boundary-tags/{id}")
    @Timed
    public ResponseEntity<Void> deleteBoundaryTag(@PathVariable Long id) {
        log.debug("REST request to delete BoundaryTag : {}", id);
        boundaryTagService.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id.toString())).build();
    }
}
